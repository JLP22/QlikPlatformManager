using QlikPlatformManager.Utils;
using QlikPlatformManager.DAL;
using QlikPlatformManager.ViewModels;
using QlikUtils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Runtime.Caching;

namespace QlikPlatformManager.Controllers
{
    public class ArchiverController : Controller
    {
        //Pour eviter des using dans le corps de l'action (factorise dal)
        private IDal Dal;
        private QlikEngineConnexion QConnexion;

        //Surcharge le controleur (si aucun paramètre lui est filé, on file par défaut new dal() à RestaurantController(IDal dalIoc))
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
            //if(archiverApplicationViewModel == null) archiverApplicationViewModel = new ArchiverApplicationViewModel();
            /*ArchiverApplicationViewModel archiverApplicationViewModel = new ArchiverApplicationViewModel {
                _ServeurSource = Common.ToSelectListItem(dal.ObtenirListeServeurs()),
                _FluxSource = Common.ToSelectListItem(dal.ObtenirListeFlux()),
                _ApplicationSource = Common.ToSelectListItem(dal.ObtenirListeApplications())
            };*/

            ArchiverApplicationViewModel archiverApplicationViewModel = new ArchiverApplicationViewModel();
            PopulateList(archiverApplicationViewModel.ConnexionSource);

            return View(archiverApplicationViewModel);
        }

        [HttpPost]
        [ActionName("Application")]
        public ActionResult ApplicationPost(ArchiverApplicationViewModel archiverApplicationViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            ServeurViewModel archiverConnexion = archiverApplicationViewModel.ConnexionSource;
            archiverConnexion.ServeurSourceInfos = "";
            //--------------------------------------------------------------
            //Connexion serveur
            string serveurSource = archiverConnexion.ServeurSource;
            
            try
            {
                //Liste serveur
                string sessionName = "Connexion_" + User.Identity.Name;
                QConnexion = (QlikEngineConnexion)Common.GetObjectInCache(sessionName);

                if (QConnexion != null && QConnexion.Host != archiverConnexion.ServeurSource) QConnexion.PurgeConnexion();
                if (QConnexion == null || QConnexion.Host != archiverConnexion.ServeurSource)
                {
                    //Création de la connexion
                    bool isLocalConnection = false;
                    archiverApplicationViewModel.Results.addDetails("Connexion au serveur en attente");
                    QConnexion = new QlikEngineConnexion(archiverConnexion.ServeurSource, "CERPBN", "biadm", "ezabrhBm", QConnexion, isLocalConnection);
                    archiverApplicationViewModel.Results.addDetails("Connexion au serveur réussie");
                    //Mise en cache de la connexion
                    Common.SetObjectInCache(sessionName, QConnexion);
                }
                
                //Alimentation des listes (serveur, flux et source)
                PopulateList(archiverApplicationViewModel.ConnexionSource);

                //--------------------------------------------------------------
                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel)
                {
                    PopulateList(archiverApplicationViewModel.ConnexionSource);
                    archiverApplicationViewModel.Results.Title = "";
                    return PartialView(archiverApplicationViewModel);
                }               

                //--------------------------------------------------------------
                //Valide les valeurs saisie dans la vue pour traitement
                string sourceServeurId = archiverConnexion.ServeurSource;
                string sourceServeurName = Common.GetText(archiverConnexion._ServeurSource, sourceServeurId);
                string sourceFluxId = archiverConnexion.FluxSource;
                string sourceFluxName = Common.GetText(archiverConnexion._FluxSource, sourceFluxId);
                string sourceApplicationId = archiverConnexion.ApplicationSource;
                string sourceApplicationName = Common.GetText(archiverConnexion._ApplicationSource, sourceApplicationId);
                bool sourceApplicationWithData = archiverApplicationViewModel.AvecDonnees;

                //Par défaut resultat = erreur
                archiverApplicationViewModel.Results.Title = "Archivage KO";
                archiverApplicationViewModel.Results.Resume = "Archivage de l'application " + sourceApplicationName + " à partir du flux " + sourceFluxName + " du serveur " + sourceServeurName;
                //archiverApplicationViewModel.Results.addDetails("Etape de l'archivage");

                //Recherche de l'Id de l'application
                string applicationSourceName = archiverConnexion._ApplicationSource.Where(x => x.Value == archiverConnexion.ApplicationSource).DefaultIfEmpty(new SelectListItem(){}).First().Text;
                if (String.IsNullOrEmpty(sourceServeurId) || String.IsNullOrEmpty(sourceServeurName) || String.IsNullOrEmpty(sourceFluxId) || String.IsNullOrEmpty(sourceFluxName) || String.IsNullOrEmpty(sourceApplicationId) || String.IsNullOrEmpty(sourceApplicationName))
                {
                    if(String.IsNullOrEmpty(sourceServeurId)) archiverApplicationViewModel.Results.addDetails("Id du serveur non trouvé...");
                    if(String.IsNullOrEmpty(sourceServeurName)) archiverApplicationViewModel.Results.addDetails("Nom du serveur non trouvé...");
                    if(String.IsNullOrEmpty(sourceFluxId)) archiverApplicationViewModel.Results.addDetails("Id du flux non trouvé...");
                    if(String.IsNullOrEmpty(sourceFluxName)) archiverApplicationViewModel.Results.addDetails("Nom du flux non trouvé...");
                    if(String.IsNullOrEmpty(sourceApplicationId)) archiverApplicationViewModel.Results.addDetails("Id de l'application non trouvé...");
                    if(String.IsNullOrEmpty(sourceApplicationName)) archiverApplicationViewModel.Results.addDetails("Nom de l'application non trouvé...");
                    return PartialView(archiverApplicationViewModel);
                }

                //--------------------------------------------------------------
                //Lancement de l'archivage

                //Archivage
                archiverApplicationViewModel.Results.addDetails("Début de l'archivage");
                string archiveRepertoire = @"C:\Temp\";
                string suffixeArchiveDir = "-ArchiQlik";

                string createdFile = QConnexion.ArchivageApplication(sourceApplicationName, sourceApplicationId, archiveRepertoire, sourceApplicationWithData, 7, suffixeArchiveDir);

                string fileDirectory = archiveRepertoire + DateTime.Now.ToString("yyyyMMdd") + suffixeArchiveDir.Replace(" ", "%20");
                string filePath = fileDirectory + "\\" + createdFile;

                archiverApplicationViewModel.Results.addDetails("Fichier archivé sur le serveur : " + filePath + " (" + QlikUtils.Utilitaires.FileSizeMo(filePath) + "Mo)");
                archiverApplicationViewModel.Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + filePath + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDirectory + "\">>Ouvrir le répertoire</a>");
                //Reussite
                archiverApplicationViewModel.Results.Title = "Archivage OK";
                return PartialView(archiverApplicationViewModel);

            }
            catch (Exception e)
            {
                archiverConnexion.ServeurSourceInfos = "";
                archiverApplicationViewModel.Results.Title = "Archivage KO";
                archiverApplicationViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverApplicationViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverApplicationViewModel);
            }      
        }
        
        public ActionResult DownloadFile(string fullFileName)
        {
            string fileName = fullFileName.Split('\\').Last();
            byte[] fileBytes = System.IO.File.ReadAllBytes(fullFileName);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        //-----------------------------------------------------------------------
        // Alimentation des select Serveur / Flux / Application
        //-----------------------------------------------------------------------
        public void PopulateList(ServeurViewModel model)
        {
            //Liste serveur
            string listName = "serveurList";
            model._ServeurSource = (List<SelectListItem>)Common.GetObjectInCache(listName);
            if (model._ServeurSource == null)
            {
                model._ServeurSource = Common.ToSelectListItem(Dal.ObtenirListeServeurs());
                Common.SetObjectInCache(listName, model._ServeurSource);
            }

            //Liste flux et application
            if (QConnexion != null)
            {
                //Recherche liste des Stream par application
                //Collection renvoyées (clé soit Id, soit Name et value = objet issu du JSON)
                QConnexion.InitListeApplication();
                model.ServeurSourceInfos = QConnexion.GetHtmlServeurInfos();
            }

            //Liste Streams
            model._FluxSource = Common.ToSelectListItem(QConnexion);
            //Liste applications
            model._ApplicationSource = Common.ToSelectListItem(QConnexion, model.FluxSource);

            //Ajout des info bulle sur la coche
            if (!string.IsNullOrEmpty(model.FluxSource))
            {
                string fluxName = model._FluxSource.Where(x => x.Value == model.FluxSource).DefaultIfEmpty(new SelectListItem() { }).First().Text;
                model.FluxSourceInfos = QConnexion.GetHtmlFluxInfos(fluxName);
                model.ApplicationsSourceInfos = QConnexion.GetHtmlApplicationsInfos(fluxName);
            }
        }

        // GET: Archiver
        public ActionResult Structure()
        {
            ArchiverStructureViewModel archiverStructureViewModel = new ArchiverStructureViewModel();
            PopulateList(archiverStructureViewModel.ServeurRef);
            PopulateList(archiverStructureViewModel.ServeurComp);

            return View(archiverStructureViewModel);
        }

        [HttpPost]
        [ActionName("Structure")]
        public ActionResult StructurePost(ArchiverStructureViewModel archiverStructureViewModel)
        {
            try {
                //Reussite
                archiverStructureViewModel.Results.Title = "Archivage OK";
                return PartialView(archiverStructureViewModel);

            }
            catch (Exception e)
            {
                archiverStructureViewModel.ServeurRef.ServeurSourceInfos = "";
                archiverStructureViewModel.Results.Title = "Archivage KO";
                archiverStructureViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverStructureViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverStructureViewModel);
            }
        }
        
    }
}

