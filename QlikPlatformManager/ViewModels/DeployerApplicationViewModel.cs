using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;
using static QlikUtils.QlikObjectJson;
using static QlikUtils.Utilitaires;

namespace QlikPlatformManager.ViewModels
{
    public class DeployerApplicationViewModel
    {
        //Constructeur
        public DeployerApplicationViewModel()
        {
            ServeurSource = new DeployerApplicationConnexionViewModel();
            ServeurCible = new DeployerApplicationConnexionViewModel();

            //L'objet à besoin de connaitre la config à plusieurs endroits pour ses traitements
            qpmConfig = Common.QPMGetConfig();
        }

        //Propriétés

        /* Serveur de référence */
        public DeployerApplicationConnexionViewModel ServeurSource { get; set; }

        /* Serveur de comparaison*/
        public DeployerApplicationConnexionViewModel ServeurCible { get; set; }

        /* Livraison avec les données */
        [Display(Name = "Livrer avec données et variables (inutile à partir du desktop : livraison en l'état)")]
        public bool AvecDonnees { get; set; }

        private QPMConfiguration qpmConfig;

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

        //Méthodes
        
        //------------------------------------------------------------------
        // Préfixe les champs de vue partielle par le nom de l'objet parent
        //Nécessaire pour les sous-objet
        //------------------------------------------------------------------
        public ViewDataDictionary GetViewData(HtmlHelper<DeployerApplicationViewModel> html, string serveur)
        {
            string name = "";
            if (serveur == "ServeurCible") name = html.NameFor(m => m.ServeurCible).ToString();
            else name = html.NameFor(m => m.ServeurSource).ToString();

            string prefix = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            ViewDataDictionary viewData = new ViewDataDictionary(html.ViewData)
            {
                TemplateInfo = new TemplateInfo { HtmlFieldPrefix = prefix }
            };
            return viewData;
        }

        //------------------------------------------------------------------
        // LIvrre l'application
        //------------------------------------------------------------------
        public void Livrer()
        {
            try
            {
                string importedAppID = "";
                string createdFile = ""; //Utilisées si livraison sur serveur distant
                bool etapeOk = true;
                //Si application > 1Go, livrer sans les données (Cas serveur vers desktop et livrer données demandé)
                if (AvecDonnees)
                {
                    //Livraison sur le Desktop à partir d'un serveur : vérifier taille max 1 Go
                    if (!ServeurCible.Connexion.QEngineConnexion.ServerMode && ServeurSource.Connexion.QEngineConnexion.ServerMode)
                    {
                        //Chemin du QVF source 
                        string qvsFullName = String.Empty;
                        //string serveurSourceNom = ConfigurationManager.AppSettings[ServeurSource.Connexion.QEngineConnexion.Host];
                        string serveurSourceNom = qpmConfig.Global.Environnements[ServeurSource.Connexion.QEngineConnexion.Host];
                        if (serveurSourceNom != null)
                            //qvsFullName = @"\\" + serveurSourceNom  + ConfigurationManager.AppSettings["ServerAppsDir"] + ServeurSource.Connexion.Application;
                            qvsFullName = @"\\" + serveurSourceNom  + qpmConfig.Global.Repertoires["ServerAppsDir"] + ServeurSource.Connexion.Application;
                        //Mesure de la taille du QVF
                        if (GetFileInfos(qvsFullName).SizeMo > 1000)
                        {
                            Results.addDetails("L'application à livrer sur le desktop dépasse la taille max admise (1Go).");
                            Results.addDetails("L'application sera livrée sans les données");
                            AvecDonnees = false;
                        }
                    }
                }

                Results.addDetails("Début de la livraison sur le serveur " + ServeurCible.Connexion.QEngineConnexion.Host);
                
                etapeOk = false;

                //Recherche le répertoire d'import sur le serveur cible
                var destinationServer = ServeurCible.Connexion._Serveur.Where(p => p.Value == ServeurCible.Connexion.Serveur).FirstOrDefault().Text;
                ServeurCible.Connexion.QEngineConnexion.InitImportDirectory(destinationServer);

                //Si repertoire d'import serveur récupéré
                if (!String.IsNullOrEmpty(ServeurCible.Connexion.QEngineConnexion.ImportDirectory))
                {
                    Results.addDetails("Répertoire d'import sur le serveur cible trouvé : " + ServeurCible.Connexion.QEngineConnexion.ImportDirectory);
                    if(!ServeurSource.Connexion.QEngineConnexion.ServerMode) Results.addDetails("Attention : à partir du desktop, la livraison s'effectue en l'état (avec données)");
                    //Exporter l'application sur le serveur cible
                    createdFile = ServeurSource.Connexion.QEngineConnexion.ArchivageApplication(ServeurSource.Connexion.Application, ServeurCible.Connexion.QEngineConnexion.ImportDirectory, AvecDonnees);
                    //Importer application
                    if (!String.IsNullOrEmpty(createdFile))
                    {
                        //Mode Desktop
                        if (!ServeurCible.Connexion.QEngineConnexion.ServerMode)
                        {
                            importedAppID = ServeurCible.Connexion.QEngineConnexion.ImportDirectory + createdFile;
                            Results.addDetails("Application temporaire exportée dans : " + importedAppID.Replace(" ", "%20"));
                            etapeOk = true;
                        }
                        //Mode serveur
                        else
                        {
                            Results.addDetails("Application temporaire exportée dans le répertoire d'import : " + ServeurCible.Connexion.QEngineConnexion.ImportDirectory + createdFile.Replace(" ", "%20"));
                            importedAppID = ServeurCible.Connexion.QEngineConnexion.QRSImportApplication(createdFile);
                            if (!String.IsNullOrEmpty(importedAppID))
                            {
                                Results.addDetails("Application temporaire importée sur le serveur : " + ServeurCible.Connexion.QEngineConnexion.Host);
                                etapeOk = true;
                            }
                        }
                    }
                }

                if (!etapeOk) Results.addDetails("Livraison en erreur lors du transfert de l'application sur le serveur cible. Vérifier droits sur partage \\\\ImportApps\\.");
                else
                {
                    //Remplacer l'application (sourceAppId = application temporaire)
                    etapeOk = ServeurCible.Connexion.QEngineConnexion.ReplaceApplication(ServeurCible.Connexion.Application, importedAppID);
                    if (!etapeOk) Results.addDetails("Livraison en erreur lors du remplacement de l'application");
                    else
                    {
                        Results.addDetails("Application cible remplacée par l'application temporaire");
                        if (!ServeurCible.Connexion.QEngineConnexion.ServerMode) Results.addDetails("Relancer le Desktop pour valider les modifications.");
                        else
                        {
                            /*Mis en commentaire car fait passer les feuilles qui ne sont pas de base à l'utilisateur prorprio appli cible*/
                            //Changer le propriétaire des feuilles de l'application par celui de l'application (si proprio origine != cible)
                            QRSOwnerJson ownerApplicationSource = ServeurSource.Connexion.QEngineConnexion._InfosApplicationParAppId[ServeurSource.Connexion.Application].owner;
                            QRSOwnerJson ownerApplicationCible = ServeurCible.Connexion.QEngineConnexion._InfosApplicationParAppId[ServeurCible.Connexion.Application].owner;
                            etapeOk = ServeurCible.Connexion.QEngineConnexion.QRSChangeObjectOwner(ServeurCible.Connexion.Application, ownerApplicationSource, ownerApplicationCible);
                            if (!etapeOk) Results.addDetails("Erreur lors du changement de propriétaire des feuilles");
                            else
                            {
                                Results.addDetails("Propriétaires des feuilles unifiés");
                                //Changement du propriétaire de l'application
                                etapeOk = ServeurCible.Connexion.QEngineConnexion.QRSChangeAppOwner(ServeurCible.Connexion.Application);
                                if (!etapeOk) Results.addDetails("Erreur lors du changement de propriétaire de l'application");
                                else
                                {
                                    Results.addDetails("Propriétaire de l'application modifié");
                                    //Supprimer l'application transférée
                                    etapeOk = ServeurCible.Connexion.QEngineConnexion.QRSDeleteApplication(importedAppID);
                                    if (!etapeOk) Results.addDetails("Erreur lors de la suppression de l'application");
                                    else
                                    {
                                        Results.addDetails("Application temporaire transférée supprimée : " + importedAppID);
                                        //Supprimer l'application du répertoire d'import
                                        etapeOk = DeleteQvfFile(ServeurCible.Connexion.QEngineConnexion.ImportDirectory + createdFile);
                                        if (etapeOk == true) Results.addDetails("Fichier QVF de l'application temporaire supprimé du répertoire d'import : " + ServeurCible.Connexion.QEngineConnexion.ImportDirectory + createdFile.Replace(" ", "%20"));
                                        else Results.addDetails("Livraison terminée mais erreur lors de la suppression du fichier " + ServeurCible.Connexion.QEngineConnexion.ImportDirectory + createdFile.Replace(" ", "%20"));
                                    }
                                }
                            }
                        }
                    }
                }
                if(!etapeOk) Results.Title = "Déploiement  KO";
                else Results.Title = "Déploiement OK";
            }
            catch (Exception ex)
            {
                Results.Title = "Déploiement KO";
                Results.addDetails(ex.Message);
            }
        }
    }
}