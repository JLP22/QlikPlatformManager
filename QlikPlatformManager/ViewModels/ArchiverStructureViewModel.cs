using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using QlikPlatformManager.DAL;
using QlikPlatformManager.Utils;
using QlikUtils;

namespace QlikPlatformManager.ViewModels
{
    public class ArchiverStructureViewModel
    {
        public ArchiverStructureViewModel()
        {
            ServeurRef = new ServeurViewModel();
            ServeurComp = new ServeurViewModel();
        }

        /* Serveur de référence */
        public ServeurViewModel ServeurRef { get; set; }

        /* Serveur de comparaison*/
        public ServeurViewModel ServeurComp { get; set; } 

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

    }
}