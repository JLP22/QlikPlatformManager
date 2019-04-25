﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverStructureViewModel
    {
        //Constructeur
        public ArchiverStructureViewModel()
        {
            ServeurRef = new ArchiverStructureConnexionViewModel();
            ServeurComp = new ArchiverStructureConnexionViewModel();
        }

        //Propriétés

        /* Serveur de référence */
        public ArchiverStructureConnexionViewModel ServeurRef { get; set; }

        /* Serveur de comparaison*/
        public ArchiverStructureConnexionViewModel ServeurComp { get; set; } 

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

        //Méthodes

        //------------------------------------------------------------------
        // Préfixe les champs de vue partielle par le nom de l'objet parent
        //Nécessaire pour les sous-objet
        //------------------------------------------------------------------
        public ViewDataDictionary GetViewData(HtmlHelper<ArchiverStructureViewModel> html, string serveur)
        {
            string name = "";
            if (serveur == "ServeurComp") name = html.NameFor(m => m.ServeurComp).ToString();
            else name = html.NameFor(m => m.ServeurRef).ToString();

            string prefix = html.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            ViewDataDictionary viewData = new ViewDataDictionary(html.ViewData)
            {
                TemplateInfo = new TemplateInfo { HtmlFieldPrefix = prefix }
            };
            return viewData;
        }
    }
}