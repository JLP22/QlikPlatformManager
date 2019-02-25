using QlikPlateformManager.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.ViewModels
{
    public class ResultsViewModel
    {
        public string Title { get; set; }
        public string Resume { get; set; }
        public string Details { get; set; }
        
    }
}