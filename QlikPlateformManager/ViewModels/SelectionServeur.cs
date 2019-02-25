using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public class SelectionServeur
    {
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur de l'application à archiver doit être sélectionné")]
        public List<string> SelectedServeur { get; set; }
        [Required(ErrorMessage = "Le serveur de l'application à archiver doit être sélectionné")]
        public List<SelectListItem> ServeursList
        {
            get
            {
                return InitialiseListServeur();
            }
        }

        private IDal dal;

        private List<SelectListItem> InitialiseListServeur()
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