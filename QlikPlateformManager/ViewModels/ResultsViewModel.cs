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

        public void addDetails(string details)
        {
            Details = Details + "<BR/>" + DateTime.Now.ToString("HH:mm:ss") + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + details;
        }
        
    }
}