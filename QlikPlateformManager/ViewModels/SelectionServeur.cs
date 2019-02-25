using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public static class SelectionServeur
    {

        private static IDal dal;

        public static List<SelectListItem> List()
        {
            //Création de la liste à afficher
            List<SelectListItem> serveursSelectListItem = new List<SelectListItem>();
            dal = new DalEnDur();
            foreach (Serveur serveur in dal.ObtenirListeServeurs())
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
    }
}