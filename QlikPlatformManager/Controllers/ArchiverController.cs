using QlikPlatformManager.Utils;
using QlikPlatformManager.DAL;
using QlikPlatformManager.ViewModels;
using QlikUtils;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Net;
using System.Threading.Tasks;
using System.IO;

namespace QlikPlatformManager.Controllers
{
    public class ArchiverController : Controller
    {
        //Pour eviter des using dans le corps de l'action (factorise dal)
        private IDal Dal;
       
        //Utile pour le cas normal
        public ArchiverController() : this(new Dal())
        {
        }

        //Si un Idal est passé en paramètre au constructeur, on l'utilise 
        //utile pour les tests DalEnDur
        public ArchiverController(IDal dalIoc)
        {
            Dal = dalIoc;
        }

        // GET: Archiver
        //public ActionResult Application(ArchiverApplicationViewModel archiverApplicationViewModel = null)
        public ActionResult Application()
        {
            //Création du viewModel d'archivage de l'application
            ArchiverApplicationViewModel archiverApplicationViewModel = new ArchiverApplicationViewModel();
            //Alimentation des listes du formulaire (serveur, flux et source)
            archiverApplicationViewModel.Connexion.PopulateList(Dal);

            return View(archiverApplicationViewModel);
        }

        [HttpPost]
        [ActionName("Application")]
        public ActionResult ApplicationPost(ArchiverApplicationViewModel archiverApplicationViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            ServeurViewModel archiverConnexion = archiverApplicationViewModel.Connexion;
            archiverConnexion.ServeurInfos = "";
                        
            try
            {
                //Connection au serveur
                archiverApplicationViewModel.Results.addDetails("Connexion au serveur en attente");
                archiverConnexion.Connect(User.Identity.Name);
                archiverApplicationViewModel.Results = archiverConnexion.Results;
                //Ajout de la connexion Qlik au view model
                //QConnexion = archiverApplicationViewModel.Connexion.QEngineConnexion;

                //Alimentation des listes du formulaire (serveur, flux et source)
                archiverApplicationViewModel.Connexion.PopulateList(Dal);

                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel) archiverApplicationViewModel.Results.Title = "";
                //Lancement de l'archivage
                else archiverApplicationViewModel.Connexion.Archiver(archiverApplicationViewModel.AvecDonnees);
                
                return PartialView(archiverApplicationViewModel);
                
            }
            catch (Exception e)
            {
                archiverConnexion.ServeurInfos = "";
                archiverApplicationViewModel.Results.Title = "Archivage KO";
                archiverApplicationViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverApplicationViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverApplicationViewModel);
            }      
        }
        

        // GET: Archiver
        public ActionResult Structure()
        {
            //Création du viewModel d'archivage de la structure des applications
            ArchiverStructureViewModel archiverStructureViewModel = new ArchiverStructureViewModel();
            //Alimentation des listes du formulaire (serveur, flux et source)
            archiverStructureViewModel.ServeurRef.Connexion.PopulateList(Dal);
            archiverStructureViewModel.ServeurComp.Connexion.PopulateList(Dal);

            return View(archiverStructureViewModel);
        }

        [HttpPost]
        [ActionName("Structure")]
        public ActionResult StructurePost(ArchiverStructureViewModel archiverStructureViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            ServeurViewModel structureConnexionRef = archiverStructureViewModel.ServeurRef.Connexion;
            ServeurViewModel structureConnexionComp = archiverStructureViewModel.ServeurComp.Connexion;

            structureConnexionRef.ServeurInfos = "";
            structureConnexionComp.ServeurInfos = "";

            try
            {
                //Connection au serveur de référence
                if(!string.IsNullOrEmpty(archiverStructureViewModel.ServeurRef.Connexion.Serveur))
                {
                    archiverStructureViewModel.Results.addDetails("Connexion au serveur de référence en attente");
                    structureConnexionRef.Connect(User.Identity.Name);
                    archiverStructureViewModel.Results = structureConnexionRef.Results;
                }

                //Connection au serveur de comparaison
                if (!string.IsNullOrEmpty(archiverStructureViewModel.ServeurComp.Connexion.Serveur))
                {
                    archiverStructureViewModel.Results.addDetails("Connexion au serveur de comparaison en attente");
                    structureConnexionComp.Connect(User.Identity.Name);
                    archiverStructureViewModel.Results = structureConnexionComp.Results;
                }

                //Alimentation des listes du formulaire (serveur, flux et source)
                archiverStructureViewModel.ServeurRef.Connexion.PopulateList(Dal);
                archiverStructureViewModel.ServeurComp.Connexion.PopulateList(Dal);

                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel) archiverStructureViewModel.Results.Title = "";
                //Lancement de la comparaison
                else archiverStructureViewModel.Comparer();


                //Retour à la vue
                return PartialView(archiverStructureViewModel);

            }
            catch (Exception e)
            {
                archiverStructureViewModel.ServeurRef.Connexion.ServeurInfos = "";
                archiverStructureViewModel.ServeurComp.Connexion.ServeurInfos = "";
                archiverStructureViewModel.Results.Title = "Archivage KO";
                archiverStructureViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverStructureViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverStructureViewModel);
            }
        }

        [HttpPost]
        public ActionResult Export(ArchiverStructureViewModel archiverStructureViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            string formatExport = "";
            ServeurViewModel structureConnexion;
            ServeurViewModel structureConnexionRef = archiverStructureViewModel.ServeurRef.Connexion;
            ServeurViewModel structureConnexionComp = archiverStructureViewModel.ServeurComp.Connexion;

            structureConnexionRef.ServeurInfos = "";
            structureConnexionComp.ServeurInfos = "";

            try
            {
                //Connection au serveur de référence si sélectionné sélectionnés
                if (!string.IsNullOrEmpty(structureConnexionRef.Serveur))
                {
                    archiverStructureViewModel.Results.addDetails("Connexion au serveur de référence " + structureConnexionRef.Serveur + " en attente");
                    structureConnexionRef.Connect(User.Identity.Name);
                    archiverStructureViewModel.Results.Details += structureConnexionRef.Results.Details;
                }
                //Connection au serveur de référence si sélectionné sélectionnés
                if (!string.IsNullOrEmpty(structureConnexionComp.Serveur))
                {
                    archiverStructureViewModel.Results.addDetails("Connexion au serveur de comparaison " + structureConnexionComp.Serveur + " en attente");
                    structureConnexionComp.Connect(User.Identity.Name);
                    archiverStructureViewModel.Results.Details += structureConnexionComp.Results.Details;
                }

                //Demande d'export au format JSON du serveur de référence
                if (archiverStructureViewModel.ServeurRef.ExportJson)
                {
                    archiverStructureViewModel.Results.addDetails("Demande d'export au format JSON du serveur de référence");
                    structureConnexion = archiverStructureViewModel.ServeurRef.Connexion;
                    formatExport = "json";
                }
                //Demande d'export au format Xls du serveur de référence
                else if (archiverStructureViewModel.ServeurRef.ExportXls)
                {
                    archiverStructureViewModel.Results.addDetails("Demande d'export au format Xls du serveur de référence");
                    structureConnexion = archiverStructureViewModel.ServeurRef.Connexion;
                    formatExport = "xls";
                }
                //Demande d'export au format JSON du serveur de comparaison
                else if (archiverStructureViewModel.ServeurComp.ExportJson)
                {
                    archiverStructureViewModel.Results.addDetails("Demande d'export au format JSON du serveur de comparaison");
                    structureConnexion = archiverStructureViewModel.ServeurComp.Connexion;
                    formatExport = "json";
                }
                //Demande d'export au format Xls du serveur de comparaison
                else if (archiverStructureViewModel.ServeurComp.ExportXls)
                {
                    archiverStructureViewModel.Results.addDetails("Demande d'export au format Xls du serveur de comparaison");
                    structureConnexion = archiverStructureViewModel.ServeurComp.Connexion;
                    formatExport = "xls";
                }
                else
                {
                    archiverStructureViewModel.Results.addDetails("Archiver/Export : ne devrait pas se produire");
                    archiverStructureViewModel.Results.Title = "KO";
                    return PartialView("Structure", archiverStructureViewModel);
                }

                //Alimentation des listes du formulaire (serveur, flux et source)
                archiverStructureViewModel.ServeurRef.Connexion.PopulateList(Dal);
                archiverStructureViewModel.ServeurComp.Connexion.PopulateList(Dal);
                //RAZ booleen export
                archiverStructureViewModel.ServeurRef.ExportXls = false;
                archiverStructureViewModel.ServeurRef.ExportJson = false;
                archiverStructureViewModel.ServeurComp.ExportXls = false;
                archiverStructureViewModel.ServeurComp.ExportJson = false;

                //Lancement de l'export
                structureConnexion.Exporter(formatExport);             

                //Fusion des informations de détails
                archiverStructureViewModel.Results.Title += structureConnexion.Results.Title ;
                archiverStructureViewModel.Results.Details += archiverStructureViewModel.ServeurComp.Results.Details;
                archiverStructureViewModel.Results.Details += archiverStructureViewModel.ServeurRef.Results.Details ;
                archiverStructureViewModel.Results.Details += structureConnexion.Results.Details ;
                archiverStructureViewModel.Results.Resume+= structureConnexion.Results.Resume;

                //Retour à la vue
                return PartialView("Structure", archiverStructureViewModel);

            }
            catch (Exception e)
            {
                archiverStructureViewModel.Results.Title = "Archivage KO";
                archiverStructureViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverStructureViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView("Structure", archiverStructureViewModel);
            }
        }
        public ActionResult DownloadFile(string fullFileName)
        {
            string fileName = fullFileName.Split('\\').Last();
            byte[] fileBytes = System.IO.File.ReadAllBytes(fullFileName);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }
    }
}

