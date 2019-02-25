using QlikPlateformManager.ViewModels;
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
        public ActionResult Archive(ArchiverApplicationViewModel archiverApplicationViewModel)
        {
            //ResultsViewModel resultArchivage = new ResultsViewModel();
            System.Threading.Thread.Sleep(2000);
            //Erreur
            archiverApplicationViewModel.Results.Title = "Archivage KO";
            archiverApplicationViewModel.Results.Resume = "Archivage de l'application XXX à partir du flux YYY du serveur ZZZ";
            archiverApplicationViewModel.Results.Details = "Etape de l'archivage :";
            /*bool isValidGlobalModel = ModelState.IsValid
                                        && TryValidateModel(archiverApplicationViewModel.ServeurSource, "ApplicationSource.")
                                        && TryValidateModel(archiverApplicationViewModel.FluxSource, "ApplicationSource.")
                                        && TryValidateModel(archiverApplicationViewModel.ApplicationSource, "ApplicationSource.");*/
            bool isValidGlobalModel = ModelState.IsValid;
            if (!isValidGlobalModel)
            {
                
                return View(archiverApplicationViewModel);
            }


            //Reussite
            archiverApplicationViewModel.Results.Title = "Archivage OK";
            archiverApplicationViewModel.Results.Resume = "Archivage de l'application XXX à partir du flux YYY du serveur ZZZ";
            archiverApplicationViewModel.Results.Details = "Etape de l'archivage :";

            return View(archiverApplicationViewModel);
            //}
        }

        //Affichage du résultat
        public ActionResult Results(ResultsViewModel resultArchivage)
        {
            

            System.Threading.Thread.Sleep(2000);
            return PartialView(resultArchivage);
        }
    }
}