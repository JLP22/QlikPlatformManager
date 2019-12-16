using System.Security;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;
using System;
using System.Configuration;

namespace QlikPlatformManager.ViewModels
{
    //View model utilisé lorsque la sélection d'un serveur + flux + application est demandée
    public class ServeurViewModel
    {
        //Constructeur
        public ServeurViewModel()
        {
            //L'objet à besoin de connaitre la config à plusieurs endroits pour ses traitements
            qpmConfig = Common.QPMGetConfig();
        }
        private QPMConfiguration qpmConfig;
        
        //Propriétés

        //-- Serveurs
        //Liste des serveurs
        public List<SelectListItem> _Serveur { get; set; }
        //Serveur sélectionné
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur doit être sélectionné")]
        public string Serveur { get; set; }
        //Infos du serveur sélectionné
        public string ServeurInfos { get; set; }

        //-- Flux
        //Liste des flux
        public List<SelectListItem> _Flux { get; set; }
        //Flux sélectionné
        [Display(Name = "Flux")]
        [Required(ErrorMessage = "Le flux doit être sélectionné")]
        public string Flux { get; set; }
        //Infos du flux sélectionné
        public string FluxInfos { get; set; }

        //-- Applications
        //Liste des applications
        public List<SelectListItem> _Application { get; set; }
        //Application sélectionnée
        [Display(Name = "Application")]
        [Required(ErrorMessage = "L'application doit être sélectionnée")]
        public string Application { get; set; }
        //Infos par Id d'application
        public Dictionary<string,string> ApplicationsInfos { get; set; }

        //--Autres
        //connexion établit par le formulaire
        public QlikEngineConnexion QEngineConnexion { get; set; }
        //Détails de la connexion établit par le formulaire
        public ResultsViewModel Results = new ResultsViewModel();
        //Nom de la connexion utilisateur
        public string UserConnexion;

        //Méthodes

        //-----------------------------------------------------------------------
        // Alimentation des select Serveur / Flux / Application
        //-----------------------------------------------------------------------
        public void PopulateList(IDal dal, bool keepDesktop = false)
        {
            //Recherche dans le cache la liste des serveurs définit en bdd
            string listName = "serveurBddList";
            List<Models.Serveur> _serveursBdd = (List<Models.Serveur>)Common.GetObjectInCache(listName);
            //List<Models.Serveur> _serveurs = (List<Models.Serveur>)Common.GetObjectInCache(listName);
            //Si la liste des serveurs définit en bdd n'existe pas dans le cache, on la recherche en base et on sauvegarde
            if (_serveursBdd == null)
            {
                _serveursBdd = dal.ObtenirListeServeurs();
                //Sauvegarde en cache des serveurs défini en Bdd
                Common.SetObjectInCache(listName, _serveursBdd);
            }
            //Initialise la liste de serveur avec celle de bdd
            List<Models.Serveur> _serveurs = new List<Models.Serveur>(_serveursBdd);

            ///Si le serveur desktop ne doit pas etre dans la liste, on s'assure de sa suppression
            if (!keepDesktop) _serveurs.RemoveAll(isDesktop);

            //Si le serveur desktop doit etre dans la liste, on l'ajoute
            //if ( keepDesktop && _serveurs.Where(s => s.Url == ConfigurationManager.AppSettings["Localhost"]).Count() < 1)
            if ( keepDesktop && _serveurs.Where(s => s.Url == qpmConfig.Global.Environnements["Localhost"]).Count() < 1)
            {
                //Models.Serveur serveurLocalhost = new Models.Serveur { Id = "3", Nom = Common.GetHostName(), Url = ConfigurationManager.AppSettings["Localhost"], Description = "Desktop" };
                Models.Serveur serveurLocalhost = new Models.Serveur { Id = "3", Nom = Common.GetHostName(), Url = qpmConfig.Global.Environnements["Localhost"], Description = "Desktop" };
                _serveurs.Add(serveurLocalhost);
            }

            //Liste finale des serveurs
            _Serveur = Common.ToSelectListItem(_serveurs);

            //Liste flux et application
            if (QEngineConnexion != null)
            {
                //Recherche liste des Stream par application
                //Collection renvoyées (clé soit Id, soit Name et value = objet issu du JSON)
                QEngineConnexion.InitListeApplication(qpmConfig.Global.Repertoires["ImportDirectory"]);
                ServeurInfos = QEngineConnexion.GetHtmlServeurInfos();
            }

            //Liste Streams
            _Flux = Common.ToSelectListItem(QEngineConnexion);
            //Liste applications
            _Application = Common.ToSelectListItem(QEngineConnexion, Flux);

            //Ajout des info bulle sur la coche
            if (QEngineConnexion != null && !string.IsNullOrEmpty(Flux))
            {
                string fluxName = _Flux.Where(x => x.Value == Flux).DefaultIfEmpty(new SelectListItem() { }).First().Text;
                FluxInfos = QEngineConnexion.GetHtmlFluxInfos(fluxName);
                ApplicationsInfos = QEngineConnexion.GetHtmlApplicationsInfos(fluxName);
            }
        }
        private bool isDesktop(Models.Serveur item)
        {
            //return (item.Url == ConfigurationManager.AppSettings["Localhost"]);
            return (item.Url == qpmConfig.Global.Environnements["Localhost"]);
        }
        
        //-----------------------------------------------------------------------
        // Connection au serveur Qlik 
        //-----------------------------------------------------------------------
        public void Connect(string userPortail)
        {
            UserConnexion = "Connexion_" + userPortail + "_" + Serveur;

            QEngineConnexion = (QlikEngineConnexion)Common.GetObjectInCache(UserConnexion);
            if (QEngineConnexion != null) Results.addDetails("Connexion au serveur via la connexion trouvée en cache " + UserConnexion);
            if (QEngineConnexion != null && QEngineConnexion.Host != Serveur) QEngineConnexion.PurgeConnexion();
            if (QEngineConnexion == null || QEngineConnexion.Host != Serveur)
            {
                //Création de la connexion
                //bool isLocalConnection = false;
                Results.addDetails("Connexion au serveur en attente");
                var hostName = "";
                //if (Serveur == ConfigurationManager.AppSettings["Rec-Prod"] || Serveur == ConfigurationManager.AppSettings["Dev"]) hostName = ConfigurationManager.AppSettings[Serveur];
                if (Serveur == qpmConfig.Global.Environnements["Rec-Prod"] || Serveur == qpmConfig.Global.Environnements["Dev"]) hostName = qpmConfig.Global.Environnements[Serveur];
                else hostName = Common.GetHostName();
                //QEngineConnexion = new QlikEngineConnexion(Serveur, hostName, "CERPBN", "biadm", "ezabrhBm", QEngineConnexion, isLocalConnection);
                QEngineConnexion = new QlikEngineConnexion(Serveur, hostName, "CERPBN", "biadm", "ezabrhBm", QEngineConnexion);
                Results.addDetails("Connexion au serveur réussie");
                //Mise en cache de la connexion
                Common.SetObjectInCache(UserConnexion, QEngineConnexion);
                Results.addDetails("Connexion " + UserConnexion + " mise en cache");
            }
        }

        //Méthodes

        //--------------------------------------------------------------
        // Execution de l'archivage
        //--------------------------------------------------------------
        public void Archiver(bool withData)
        {
            //Si données valides, archiver 
            if (DataValidate("Archivage")) ArchiverExecute(withData);
        }

        //--------------------------------------------------------------
        // Execution de l'archivage (format json ou xls)
        //--------------------------------------------------------------
        public void Exporter(string format)
        {
            //Répertoire d'export
            //string exportDir = ConfigurationManager.AppSettings["ExportDirectory"];
            //Fichier à créer directement sur le poste local (rassemble l'étape de création puis de copie)
            //string exportDir = "\\\\" + Common.GetHostName() + "\\" + ConfigurationManager.AppSettings["ImportDirectory"] + "\\";
            string exportDir = "\\\\" + Common.GetHostName() + "\\" + qpmConfig.Global.Repertoires["ImportDirectory"] + "\\";
            //string suffixeExportDir = ConfigurationManager.AppSettings["ExportSuffix"];
            string suffixeExportDir = qpmConfig.Global.Fichiers["ExportSuffix"];
            string fileDir = exportDir + DateTime.Now.ToString("yyyyMMdd") + suffixeExportDir.Replace(" ", "%20") + @"\";

            //Si données valides, archiver 
            if (DataValidate("Export") && format.Equals("json")) ExportJsonExecute(fileDir);
            if (DataValidate("Export") && format.Equals("xls")) ExportXlsExecute(fileDir);

        }

        //--------------------------------------------------------------
        // Validation des données préalable à l'export
        //--------------------------------------------------------------
        private bool DataValidate(string actionFor)
        {

            string sourceServeurId = Serveur;
            string sourceServeurName = Common.GetText(_Serveur, sourceServeurId);
            string sourceFluxId = Flux;
            string sourceFluxName = Common.GetText(_Flux, sourceFluxId);
            string sourceApplicationId = Application;
            string sourceApplicationName = Common.GetText(_Application, sourceApplicationId);        

            //Recherche de l'Id de l'application
            string applicationSourceName = _Application.Where(x => x.Value == Application).DefaultIfEmpty(new SelectListItem() { }).First().Text;
            if (String.IsNullOrEmpty(sourceServeurId) || String.IsNullOrEmpty(sourceServeurName) || String.IsNullOrEmpty(sourceFluxId) || String.IsNullOrEmpty(sourceFluxName) || String.IsNullOrEmpty(sourceApplicationId) || String.IsNullOrEmpty(sourceApplicationName))
            {
                Results.Title = actionFor + " KO";
                Results.Resume = actionFor + " Erreur : application " + sourceApplicationName + " du flux " + sourceFluxName + " du serveur " + sourceServeurName;
                if (String.IsNullOrEmpty(sourceServeurId)) Results.addDetails("Id du serveur non trouvé...");
                if (String.IsNullOrEmpty(sourceServeurName)) Results.addDetails("Nom du serveur non trouvé...");
                if (String.IsNullOrEmpty(sourceFluxId)) Results.addDetails("Id du flux non trouvé...");
                if (String.IsNullOrEmpty(sourceFluxName)) Results.addDetails("Nom du flux non trouvé...");
                if (String.IsNullOrEmpty(sourceApplicationId)) Results.addDetails("Id de l'application non trouvé...");
                if (String.IsNullOrEmpty(sourceApplicationName)) Results.addDetails("Nom de l'application non trouvé...");
                return false;
            }
            return true;
        }

        //--------------------------------------------------------------
        // Execution de l'archivage
        //--------------------------------------------------------------
        private void ArchiverExecute(bool withData)
        {            
            Results.addDetails("Début de l'archivage");
            //string archiveRepertoire = ConfigurationManager.AppSettings["ExportDirectory"];
            //string archiveRepertoire = "\\\\" + Common.GetHostName() + "\\" + ConfigurationManager.AppSettings["ImportDirectory"] + "\\"; 
            string archiveRepertoire = "\\\\" + Common.GetHostName() + "\\" + qpmConfig.Global.Repertoires["ImportDirectory"] + "\\"; 
            //string suffixeArchiveDir = ConfigurationManager.AppSettings["ArchivSuffix"];
            string suffixeArchiveDir = qpmConfig.Global.Fichiers["ArchivSuffix"];
            string sourceApplicationId = Application;
            string sourceApplicationName = Common.GetText(_Application, sourceApplicationId);
            string createdFile = QEngineConnexion.ArchivageApplication(sourceApplicationId, archiveRepertoire, withData, 7, suffixeArchiveDir);
            string fileDirectory = archiveRepertoire + DateTime.Now.ToString("yyyyMMdd") + suffixeArchiveDir.Replace(" ", "%20");
            string filePath = fileDirectory + "\\" + createdFile;

            Results.addDetails("Application archivée dans : " + filePath + " (" + QlikUtils.Utilitaires.GetFileInfos(filePath).SizeMo + "Mo)");
            Results.addDetails("<a href=\"file:///" + fileDirectory + "\">>Ouvrir le répertoire</a>");
            //Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + filePath + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDirectory + "\">>Ouvrir le répertoire</a>");

            Results.Title = "Archivage OK";
        }

        //--------------------------------------------------------------
        // Export au format xls
        //--------------------------------------------------------------
        private void ExportXlsExecute(string fileDir)
        {
            Results.addDetails("Début de l'export du modèle de l'application au format Excel");
            
            string fullFileName = QEngineConnexion.CsvCreateExport(Application, fileDir);

            if (string.IsNullOrEmpty(fullFileName)) Results.addDetails("Export du modèle en erreur");
            else 
            {
                Results.addDetails("Fichier exporté dans : " + fullFileName.Replace(" ", "%20"));
                Results.addDetails("<a href =\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                //Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + fullFileName.Replace(" ", "%20") + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                Results.Title = "Export OK";
            }

        }

        //--------------------------------------------------------------
        // Export au format json
        //--------------------------------------------------------------
        private void ExportJsonExecute(string fileDir)
        {
            Results.addDetails("Début de l'export du modèle de l'application au format Json");

            string fullFileName = QEngineConnexion.JsonCreateExport(Application, fileDir);
            if (fullFileName.Equals("")) Results.addDetails("Export du modèle en erreur");
            else
            {
                Results.addDetails("Fichier exporté dans : " + fullFileName.Replace(" ", "%20"));
                Results.addDetails("<a href =\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                //Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + fullFileName.Replace(" ", "%20") + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDir + "\">>Ouvrir le répertoire</a>");
                Results.Title = "Export OK";
            }

        }
    }
}