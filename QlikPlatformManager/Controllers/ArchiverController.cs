using QlikPlatformManager.Utils;
using QlikPlatformManager.DAL;
using QlikPlatformManager.ViewModels;
using QlikUtils;
using System;
using System.Linq;
using System.Web.Mvc;

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
                QConnexion = archiverApplicationViewModel.Connexion.QEngineConnexion;

                //Alimentation des listes du formulaire (serveur, flux et source)
                archiverApplicationViewModel.Connexion.PopulateList(Dal);

                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel) archiverApplicationViewModel.Results.Title = "";
                //Lancement de l'archivage
                else archiverApplicationViewModel.Archiver();
                
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
        
        public ActionResult DownloadFile(string fullFileName)
        {
            string fileName = fullFileName.Split('\\').Last();
            byte[] fileBytes = System.IO.File.ReadAllBytes(fullFileName);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
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
                //Connection au serveur
                archiverStructureViewModel.Results.addDetails("Connexion au serveur en attente");
                structureConnexionRef.Connect(User.Identity.Name);
                archiverStructureViewModel.Results = structureConnexionRef.Results;
                //Ajout de la connexion Qlik au view model /!\
                QConnexion = structureConnexionRef.QEngineConnexion;

                //Alimentation des listes du formulaire (serveur, flux et source)
                archiverStructureViewModel.ServeurRef.Connexion.PopulateList(Dal);

                //Retour à la vue si ni flux, ni application sélectionnée
                if (!isValidGlobalModel) archiverStructureViewModel.Results.Title = "";
                //Lancement de l'archivage
                //else archiverStructureViewModel.Archiver();
                System.Threading.Thread.Sleep(4000);

                return PartialView(archiverStructureViewModel);

            }
            catch (Exception e)
            {
                archiverStructureViewModel.ServeurRef.Connexion.ServeurInfos = "";
                archiverStructureViewModel.Results.Title = "Archivage KO";
                archiverStructureViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverStructureViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverStructureViewModel);
            }
        }
    }
}

