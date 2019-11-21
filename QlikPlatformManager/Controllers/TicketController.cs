using Newtonsoft.Json;
using QlikPlatformManager.Models;
using QlikUtils;
using QlikUtils.Connection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Web.Http;

namespace QlikPlatformManager.Controllers
{
    [RoutePrefix("api")]
    public class TicketController : ApiController
    {

        /*---------------------------------------------------------*/
        /* GetTicket : renvoi un ticket pour le serveur*/
        /*---------------------------------------------------------*/

        [Route("ticket/{host}")]
        public TicketAPI GetTicket(string host)
        {
            TicketAPI ticket = new TicketAPI();
            
            try
            {
                /*ticket.Id = 1234;
                ticket.Name = "toti";
                return ticket;*/
                //return "123";
                
                X509Certificate2Collection certificateCollection = Utilitaires.GetCertificate(host);
                X509Certificate2 certificate = certificateCollection[0];
                TicketByCertificate ticketeByCert = new TicketByCertificate(certificate);

                string domain = User.Identity.Name.Split('\\')[0];
                string user = User.Identity.Name.Split('\\')[1];
                string ticketresponse = ticketeByCert.TicketRequest("POST", host, user, domain);
                ticket = JsonConvert.DeserializeObject<TicketAPI>(ticketresponse);

                Console.WriteLine(ticketresponse);

                return ticket;

            }
            catch (Exception e)
            {
                return ticket;
                //return  "Mon Erreur : "+ e.Message;
            }
        }
    }
}
