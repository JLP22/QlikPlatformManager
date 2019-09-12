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