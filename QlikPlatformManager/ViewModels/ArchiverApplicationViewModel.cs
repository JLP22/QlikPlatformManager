using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverApplicationViewModel
    {
        public ArchiverApplicationViewModel() { ConnexionSource  = new ServeurViewModel(); }

        public ServeurViewModel ConnexionSource { get; set; } 
        [Display(Name = "Archiver avec données et variables")]
        public bool AvecDonnees { get; set; }
        public ResultsViewModel Results = new ResultsViewModel();

    }
}