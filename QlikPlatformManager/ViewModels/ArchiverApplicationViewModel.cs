using QlikPlatformManager.DAL;
using QlikPlatformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverApplicationViewModel
    {
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur de l'application à archiver doit être sélectionné")]
        public string ServeurSource { get; set; }
        //public List<string> ServeurSource { get; set; }
        public List<SelectListItem> _ServeurSource { get; set; }

        [Display(Name = "Flux")]
        [Required(ErrorMessage = "Le flux de l'application à archiver doit être sélectionné")]
        public string FluxSource { get; set; }
        public List<SelectListItem> _FluxSource { get; set; }

        [Display(Name = "Application")]
        [Required(ErrorMessage = "L'application à archiver doit être sélectionnée")]
        public string ApplicationSource { get; set; }
        public List<SelectListItem> _ApplicationSource { get; set; }

        [Display(Name = "Archiver avec données et variables")]
        public bool AvecDonnees { get; set; }
        public ResultsViewModel Results = new ResultsViewModel();

    }
}