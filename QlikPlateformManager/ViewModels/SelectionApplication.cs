using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public class SelectionApplication
    {
         [Display(Name = "Serveur")]
         [Required(ErrorMessage = "L'application à archiver doit être sélectionné")]
         public List<string> SelectedApplication { get; set; }
         public List<SelectListItem> ApplicationsList
         {
             get
             {
                 return InitialiseListApplication();
             }
         }

         private IDal dal;

         private List<SelectListItem> InitialiseListApplication()
         {
             //Création de la liste à afficher
             List<SelectListItem> applicationsSelectListItem = new List<SelectListItem>();
             dal = new DalEnDur();
             foreach (Application application in dal.ObtenirListeApplications())
             {
                 SelectListItem selectList = new SelectListItem()
                 {
                     Text = application.Nom,
                     Value = application.Id
                 };
                 applicationsSelectListItem.Add(selectList);
             }

             return applicationsSelectListItem;
         }      
    }
}