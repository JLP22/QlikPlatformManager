using QlikPlateformManager.Utils;
using QlikPlateformManager.ViewModels;
using QlikUtils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.Controllers
{
    public class ArchiverController : Controller
    {
        // GET: Archiver
        //public ActionResult Application(ArchiverApplicationViewModel archiverApplicationViewModel = null)
        public ActionResult Application()
        {
            //if(archiverApplicationViewModel == null) archiverApplicationViewModel = new ArchiverApplicationViewModel();
            ArchiverApplicationViewModel archiverApplicationViewModel = new ArchiverApplicationViewModel();
            return View(archiverApplicationViewModel);
        }

        [HttpPost]
        [ActionName("Application")]
        public ActionResult ApplicationPost(ArchiverApplicationViewModel archiverApplicationViewModel)
        {
            bool isValidGlobalModel = ModelState.IsValid;
            //ResultsViewModel resultArchivage = new ResultsViewModel();
            System.Threading.Thread.Sleep(2000);
            
            if (!isValidGlobalModel)
            {
                archiverApplicationViewModel.Results.Title = "";
                return PartialView(archiverApplicationViewModel);
            }

            //Variables de travail
            string sourceServeurId = archiverApplicationViewModel.ServeurSource;
            string sourceServeurName = Common.GetText(archiverApplicationViewModel._ServeurSource, sourceServeurId);

            string sourceFluxId = archiverApplicationViewModel.FluxSource;
            string sourceFluxName = Common.GetText(archiverApplicationViewModel._FluxSource, sourceFluxId);

            string sourceApplicationId = archiverApplicationViewModel.ApplicationSource;
            string sourceApplicationName = Common.GetText(archiverApplicationViewModel._ApplicationSource, sourceApplicationId);

            bool sourceApplicationWithData = archiverApplicationViewModel.AvecDonnees;

            //Par défaut resultat = erreur
            archiverApplicationViewModel.Results.Title = "Archivage KO";
            archiverApplicationViewModel.Results.Resume = "Archivage de l'application " + sourceApplicationName + " à partir du flux " + sourceFluxName + " du serveur " + sourceServeurName;
            //archiverApplicationViewModel.Results.addDetails("Etape de l'archivage");

            //Recherche de l'Id de l'application
            string applicationSourceName = archiverApplicationViewModel._ApplicationSource.Where(x => x.Value == archiverApplicationViewModel.ApplicationSource).DefaultIfEmpty(new SelectListItem(){}).First().Text;
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

            try
            {
                //Connexion au serveur
                archiverApplicationViewModel.Results.addDetails("Connexion au serveur en attente");
                QlikEngineConnexion myQlik = new QlikEngineConnexion(archiverApplicationViewModel.ServeurSource, "CERPBN", "biadm", "ezabrhBm", null, false);
                archiverApplicationViewModel.Results.addDetails("Connexion au serveur réussie");

                //Archivage
                archiverApplicationViewModel.Results.addDetails("Début de l'archivage");
                string archiveRepertoire = @"C:\Temp\";
                string suffixeArchiveDir = "-ArchiQlik";

                string createdFile = myQlik.ArchivageApplication(sourceApplicationName, sourceApplicationId, archiveRepertoire, sourceApplicationWithData, 7, suffixeArchiveDir);

                string fileDirectory = archiveRepertoire + DateTime.Now.ToString("yyyyMMdd") + suffixeArchiveDir.Replace(" ", "%20");
                string filePath = fileDirectory + "\\" + createdFile.Replace(" ", "%20");

                archiverApplicationViewModel.Results.addDetails("Fichier archivé : " + filePath + " (" + QlikUtils.Utilitaires.FileSizeMo(filePath) + "Mo) &nbsp&nbsp&nbsp&nbsp <a href=\"file:///" + fileDirectory + "\">>Ouvrir le répertoire</a>");

                //Reussite
                archiverApplicationViewModel.Results.Title = "Archivage OK";
                return PartialView(archiverApplicationViewModel);

            }
            catch (Exception e)
            {
                archiverApplicationViewModel.Results.Title = "Archivage KO";
                archiverApplicationViewModel.Results.addDetails("Erreur rencontrée : " + e.Message);
                archiverApplicationViewModel.Results.addDetails("Erreur trace : <BR/>" + e.StackTrace.Replace("\r", "<BR/>").Replace("\n", "<BR/>").Replace("<BR/><BR/>", "<BR/>"));
                return PartialView(archiverApplicationViewModel);
            }      
        }

        [HttpPost]
        public ActionResult SelectionServeur(ArchiverApplicationViewModel archiverApplicationViewModel)
        {
            if (!ModelState.IsValid)
            {
                
            }

            archiverApplicationViewModel.Results.Title = "Archivage KO";
            return PartialView(archiverApplicationViewModel);
        }

            ////Affichage du résultat
            //public ActionResult Results(ResultsViewModel resultArchivage)
            //{


            //    System.Threading.Thread.Sleep(2000);
            //    return PartialView(resultArchivage);
            //}
        }
}