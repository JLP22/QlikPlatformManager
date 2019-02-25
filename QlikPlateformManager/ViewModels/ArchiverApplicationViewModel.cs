using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public class ArchiverApplicationViewModel
    {
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur de l'application à archiver doit être sélectionné")]
        public List<string> ServeurSource { get; set; }
        public List<SelectListItem> _ServeurSource = SelectionServeur.List();

        [Display(Name = "Flux")]
        [Required(ErrorMessage = "Le flux de l'application à archiver doit être sélectionné")]
        public List<string> FluxSource { get; set; }
        public List<SelectListItem> _FluxSource = SelectionFlux.List();

        [Display(Name = "Application")]
        [Required(ErrorMessage = "L'application à archiver doit être sélectionnée")]
        public List<string> ApplicationSource { get; set; }
        public List<SelectListItem> _ApplicationSource = SelectionApplication.List();

        [Display(Name = "Archiver avec données et variables")]
        public bool AvecDonnees { get; set; }
        public ResultsViewModel Results = new ResultsViewModel();

    }
}