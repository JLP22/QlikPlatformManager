using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QlikPlatformManager.Models
{
    public class TicketAPI
    {
        public long Id { get; set; }
        public string UserDirectory { get; set; }
        public string UserId { get; set; }
        public string Ticket { get; set; }
        public string TargetUri { get; set; }
    }
}