using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.ViewModels
{
    public class ParametrageViewModel
    {

        public int ID { get; set; }
        [Display(Name = "Clé du paramètre")]
        [Required(ErrorMessage = "Une clé de recherche doit être sélectionnée")]
        public string Cle { get; set; }
        [Display(Name = "Valeur du paramètre")]
        [Required(ErrorMessage = "Une valeur doit être sélectionnée")]
        public string Valeur { get; set; }
        //Liste des types de paramètres (famille de regroupement)
        public List<SelectListItem> TypeListItems { get; set; }
        [Display(Name = "Type de paramétrage")]
        [Required(ErrorMessage = "Une valeur doit être sélectionnée")]
        public string Type { get; set; }
        [Display(Name = "Remarque sur le paramètre")]
        public string Details { get; set; }

        //Constructeur de base
        public ParametrageViewModel()
        {
            TypeListItems = InitDropDownListe_Type();
        }

        //Constructeur avec une nouvelle signature, surchargeant celui de base
        public ParametrageViewModel(Parametrage data) : this()
        {
        
            if (data != null)
            {
                ID = data.ID;
                Cle = data.Cle;
                Valeur = data.Valeur;
                Details = data.Details;
                Type = data.Type;
            }

        }

        //Alimentation de la liste de valeur Type
        private List<SelectListItem> InitDropDownListe_Type()
        {
            return new List<SelectListItem>
            {
                new SelectListItem {Selected = false, Text = "TesterDonnees", Value = "TesterDonnees" },
                new SelectListItem {Selected = false, Text = "Global", Value = "Global" }
            };
        }
    }
}