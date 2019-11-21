using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlatformManager.Models
{
    public class Parametrage
    {
        public int ID { get; set; }
        public string Cle { get; set; }
        public string Valeur { get; set; }
        public string Type { get; set; }
        public string Details { get; set; }
    }
}