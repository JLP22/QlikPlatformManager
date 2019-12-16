using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;

namespace QlikUtils.Connection
{
    public class TicketByCertificate
    {

        private X509Certificate2 Certificate_ { get; set; }

        public TicketByCertificate(X509Certificate2 certificate_)
        {
            Certificate_ = certificate_;
        }

        public string TicketRequest(string method, string server, string user, string userdirectory)
        {
            //Create URL to REST endpoint for tickets
            string url = "https://" + server + ":4243/qps/ticket";

            //Create the HTTP Request and add required headers and content in Xrfkey
            string Xrfkey = "0123456789abcdef";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url + "?Xrfkey=" + Xrfkey);
            // Add the method to authentication the user
            request.ClientCertificates.Add(Certificate_);
            request.Method = method;
            request.Accept = "application/json";
            request.Headers.Add("X-Qlik-Xrfkey", Xrfkey);
            string body = "{ 'UserId':'" + user + "','UserDirectory':'" + userdirectory + "','Attributes': []}";
            byte[] bodyBytes = Encoding.UTF8.GetBytes(body);

            if (!string.IsNullOrEmpty(body))
            {
                request.ContentType = "application/json";
                request.ContentLength = bodyBytes.Length;
                Stream requestStream = request.GetRequestStream();
                requestStream.Write(bodyBytes, 0, bodyBytes.Length);
                requestStream.Close();
            }

            // make the web request and return the content
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream stream = response.GetResponseStream();
            return stream != null ? new StreamReader(stream).ReadToEnd() : string.Empty;
        }

    }
}