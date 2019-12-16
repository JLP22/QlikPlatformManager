
using Newtonsoft.Json;
using Qlik.Engine;
using QlikPlatformManager.Utils;
using QlikPlatformManager.ViewModels;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QlikAuthNet;
using QlikUtils.Connection;
using QlikUtils;
using System.Security.Cryptography.X509Certificates;

namespace QlikPlatformManager.Controllers
{
    public class TesterController : Controller
    {
        // GET: Tester
        public ActionResult Donnees()
        {
            TesterDonneesViewModel modelIHM = new TesterDonneesViewModel();
            //return View(InitilizeData(modelIHM));
            return View(modelIHM);
        }

        // POST : Tester
        [HttpPost]
        [ActionName("Donnees")]
        public ActionResult DonneesPost(TesterDonneesViewModel modelIHM)
        {

            //if (modelIHM.SelectedApplications != null) modelIHM.SelectedEnvironnements = modelIHM.SelectedEnvironnements.Where(val => !String.IsNullOrEmpty(val)).ToArray();
            if (modelIHM.SelectedEnvironnements != null) modelIHM.SelectedEnvironnements = modelIHM.SelectedEnvironnements.Distinct().ToArray();

            //if (modelIHM.SelectedApplications != null) modelIHM.SelectedApplications = modelIHM.SelectedApplications.Where(val => !String.IsNullOrEmpty(val)).ToArray();
            if (modelIHM.SelectedApplications != null) modelIHM.SelectedApplications = modelIHM.SelectedApplications.Distinct().ToArray();

            //TesterDonneesViewModel param = InitilizeData(modelIHM);
            TesterDonneesViewModel testerDonneesViewModel = new TesterDonneesViewModel();
            //Alimentation de la liste des applications selon le modèle choisi
            if (!String.IsNullOrEmpty(modelIHM.SelectedModele)) testerDonneesViewModel.PopulateApplication(modelIHM.SelectedModele);
            // Génération des Objets à afficher selon les environements, le modèle et les applications choisis
            if (!String.IsNullOrEmpty(modelIHM.SelectedModele) &&
                    (modelIHM.SelectedApplications != null && modelIHM.SelectedApplications.Length > 0 && String.Join("", modelIHM.SelectedApplications).Trim() != "") &&
                    (modelIHM.SelectedEnvironnements != null && modelIHM.SelectedEnvironnements.Length > 0 && String.Join("", modelIHM.SelectedEnvironnements).Trim() != ""))
            {
                testerDonneesViewModel.PopulateObjectOTF(modelIHM.SelectedEnvironnements, modelIHM.SelectedModele, modelIHM.SelectedApplications);
            }

            testerDonneesViewModel.SelectedModele = modelIHM.SelectedModele;
            testerDonneesViewModel.SelectedApplications = modelIHM.SelectedApplications;
            testerDonneesViewModel.SelectedEnvironnements = modelIHM.SelectedEnvironnements;

            return PartialView(testerDonneesViewModel);
        }
    }
}