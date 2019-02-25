using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public static class SelectionFlux
    {
      
         private static IDal dal;

         public static List<SelectListItem> List()
         {
             //Création de la liste à afficher
             List<SelectListItem> fluxSelectListItem = new List<SelectListItem>();
             dal = new DalEnDur();
             foreach (Flux flux in dal.ObtenirListeFlux())
             {
                 SelectListItem selectList = new SelectListItem()
                 {
                     Text = flux.Nom,
                     Value = flux.Id
                 };
                 fluxSelectListItem.Add(selectList);
             }

             return fluxSelectListItem;
         }      
    }
}