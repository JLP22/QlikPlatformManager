using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public class SelectionFlux
    {
         [Display(Name = "Flux")]
         [Required(ErrorMessage = "Le flux de l'application à archiver doit être sélectionné")]
         public List<string> SelectedFlux { get; set; }
         public List<SelectListItem> FluxList
         {
             get
             {
                 return InitialiseListFlux();
             }
         }

         private IDal dal;

         private List<SelectListItem> InitialiseListFlux()
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