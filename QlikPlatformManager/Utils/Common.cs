using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.Utils
{
    public static class Common
    {
        //ListItem  : Renvoie le texte d'une valeur selectionnée
        public static string GetText(List<SelectListItem> myListItem, string mySelectedValue)
        {
            return myListItem.Where(x => x.Value == mySelectedValue).DefaultIfEmpty(new SelectListItem() { }).First().Text;
        }

        public static List<SelectListItem> ToSelectListItem(List<Serveur> _serveur)
        {
            //Création de la liste à afficher
            List<SelectListItem> serveursSelectListItem = new List<SelectListItem>();
            //Ajout d'une première valeur nulle
            SelectListItem selectListNull = new SelectListItem();
            serveursSelectListItem.Add(selectListNull);
            foreach (Serveur serveur in _serveur)
            {
                SelectListItem selectList = new SelectListItem()
                {
                    Text = serveur.Nom,
                    Value = serveur.Url.ToString()
                };
                serveursSelectListItem.Add(selectList);
            }
            return serveursSelectListItem;
        }

        public static List<SelectListItem> ToSelectListItem(List<Flux> _flux)
        {
            //Création de la liste à afficher
            List<SelectListItem> fluxSelectListItem = new List<SelectListItem>();
            if (_flux != null)
            {

                foreach (Flux flux in _flux)
                {
                    SelectListItem selectList = new SelectListItem()
                    {
                        Text = flux.Nom,
                        Value = flux.Id
                    };
                    fluxSelectListItem.Add(selectList);
                }
            }
            return fluxSelectListItem;
        }

        public static List<SelectListItem> ToSelectListItem(List<Application> _application)
        {
            //Création de la liste à afficher
            List<SelectListItem> applicationSelectListItem = new List<SelectListItem>();
            if (_application != null)
            {
                foreach (Application application in _application)
                {
                    SelectListItem selectList = new SelectListItem()
                    {
                        Text = application.Nom,
                        Value = application.Id
                    };
                    applicationSelectListItem.Add(selectList);
                }
            }
            return applicationSelectListItem;
        }
    }

}