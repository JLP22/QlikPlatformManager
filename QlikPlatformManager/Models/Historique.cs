using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace QlikPlatformManager.Models
{
    public class Historique
    {
        public int ID { get; set; }
        public string Utilisateur { get; set; }
        public string Origine { get; set; }
        public string Type { get; set; }
        public string Details { get; set; }
        public string Statut { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime Date { get; set; }
    }
}