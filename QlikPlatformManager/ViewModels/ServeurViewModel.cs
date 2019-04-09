using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ServeurViewModel
    {
        [Display(Name = "Serveur")]
        [Required(ErrorMessage = "Le serveur de l'application doit être sélectionné")]
        //Serveur sélectionné
        public string ServeurSource { get; set; }
        //Infos du serveur sélectionné
        public string ServeurSourceInfos { get; set; }
        //public List<string> ServeurSource { get; set; }
        public List<SelectListItem> _ServeurSource { get; set; }
        //public List<SelectListItem> _ServeurSource = SelectionServeur.List();

        [Display(Name = "Flux")]
        [Required(ErrorMessage = "Le flux de l'application doit être sélectionné")]
        //Flux sélectionné
        public string FluxSource { get; set; }
        //Infos du flux sélectionné
        public string FluxSourceInfos { get; set; }
        public List<SelectListItem> _FluxSource { get; set; }

        [Display(Name = "Application")]
        [Required(ErrorMessage = "L'application doit être sélectionnée")]
        //Application sélectionnée
        public string ApplicationSource { get; set; }
        //Infos par Id d'application
        public Dictionary<string,string> ApplicationsSourceInfos { get; set; }
        public List<SelectListItem> _ApplicationSource { get; set; }
    }
}