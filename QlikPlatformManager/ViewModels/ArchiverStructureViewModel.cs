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

        /* Serveur de référence */
        public ServeurViewModel ServeurRef = new ServeurViewModel();

        /* Serveur de comparaison*/
        public ServeurViewModel ServeurComp = new ServeurViewModel();

        /* Resultat */
        public ResultsViewModel Results = new ResultsViewModel();

    }
}