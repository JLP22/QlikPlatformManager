using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.Models
{
    //---------------------------------------------------------------------
    // Modèle Serveur 
    //---------------------------------------------------------------------
    public class Serveur
    {
        public string Id { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }

    }
}