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
        //public List<string> SelectedServeur2 { get; set; }
        public SelectionServeur ServeurSource = new SelectionServeur();
        [Required(ErrorMessage = "Le flux est obligatoire")]
        public SelectionFlux FluxSource = new SelectionFlux();
        [Required(ErrorMessage = "L'application est obligatoire")]
        public SelectionApplication ApplicationSource = new SelectionApplication();

        [Display(Name = "Archiver avec données et variables")]
        public bool AvecDonnees { get; set; }

        public ResultsViewModel Results = new ResultsViewModel();

    }
}