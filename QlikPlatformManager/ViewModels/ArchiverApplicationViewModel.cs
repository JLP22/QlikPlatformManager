using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverApplicationViewModel
    {
        //Constructeur
        public ArchiverApplicationViewModel()
        {
            Connexion  = new ServeurViewModel();
        }

        //Propriétés
        string Id { get; set; } //Si plusieurs fois le mm viewModel sur la page, permet de les nommer/identifier
        public ServeurViewModel Connexion { get; set; } 
        [Display(Name = "Archiver avec données et variables")]
        public bool AvecDonnees { get; set; }
        public ResultsViewModel Results = new ResultsViewModel();

        //Méthodes

        //--------------------------------------------------------------
        // Execution de l'archivage
        //--------------------------------------------------------------
        public void Archiver()
        {
            //Si données valides, archiver 
            if (ArchiverValidate()) ArchiverExecute();
        }

        //--------------------------------------------------------------
        // Validation des données préalable à l'archivage
        //--------------------------------------------------------------
        private bool ArchiverValidate()
        {

            string sourceServeurId = Connexion.Serveur;
            string sourceServeurName = Common.GetText(Connexion._Serveur, sourceServeurId);
            string sourceFluxId = Connexion.Flux;
            string sourceFluxName = Common.GetText(Connexion._Flux, sourceFluxId);
            string sourceApplicationId = Connexion.Application;
            string sourceApplicationName = Common.GetText(Connexion._Application, sourceApplicationId);

            //Par défaut resultat = erreur
            Results.Title = "Archivage KO";
            Results.Resume = "Archivage de l'application " + sourceApplicationName + " à partir du flux " + sourceFluxName + " du serveur " + sourceServeurName;
            
            //Recherche de l'Id de l'application
            string applicationSourceName = Connexion._Application.Where(x => x.Value == Connexion.Application).DefaultIfEmpty(new SelectListItem() { }).First().Text;
            if (String.IsNullOrEmpty(sourceServeurId) || String.IsNullOrEmpty(sourceServeurName) || String.IsNullOrEmpty(sourceFluxId) || String.IsNullOrEmpty(sourceFluxName) || String.IsNullOrEmpty(sourceApplicationId) || String.IsNullOrEmpty(sourceApplicationName))
            {
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
        private void ArchiverExecute()
        {
            //--------------------------------------------------------------
            //Lancement de l'archivage

            //Archivage
            Results.addDetails("Début de l'archivage");
            string archiveRepertoire = @"C:\Temp\";
            string suffixeArchiveDir = "-ArchiQlik";
            string sourceApplicationId = Connexion.Application;
            string sourceApplicationName = Common.GetText(Connexion._Application, sourceApplicationId);
            string createdFile = Connexion.QEngineConnexion.ArchivageApplication(sourceApplicationName, sourceApplicationId, archiveRepertoire, AvecDonnees, 7, suffixeArchiveDir);
            string fileDirectory = archiveRepertoire + DateTime.Now.ToString("yyyyMMdd") + suffixeArchiveDir.Replace(" ", "%20");
            string filePath = fileDirectory + "\\" + createdFile;

            Results.addDetails("Fichier archivé sur le serveur : " + filePath + " (" + QlikUtils.Utilitaires.FileSizeMo(filePath) + "Mo)");
            Results.addDetails("<a href =\"/Archiver/DownloadFile?fullFileName=" + filePath + "\">>Télécharger</a>&nbsp&nbsp&nbsp&nbsp<a href=\"file:///" + fileDirectory + "\">>Ouvrir le répertoire</a>");
            
            Results.Title = "Archivage OK";
        }

        //------------------------------------------------------------------
        // Préfixe les champs de vue partielle par le nom de l'objet parent
        //Nécessaire pour les sous-objet
        //------------------------------------------------------------------
        public ViewDataDictionary GetViewData(HtmlHelper<ArchiverApplicationViewModel> html)
        {
            string name = html.NameFor(m => m.Connexion).ToString();
            string prefix = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            ViewDataDictionary viewData = new ViewDataDictionary(html.ViewData)
            {
                TemplateInfo = new TemplateInfo { HtmlFieldPrefix = prefix }
            };
            return viewData;
        }
    }
}