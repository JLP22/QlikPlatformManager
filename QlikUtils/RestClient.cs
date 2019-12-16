using QlikUtils;
using System;
using System.IO;
using System.Net;
using System.Security;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Qlik.Sense.RestClient
{
    public class RestClient : WebClient, IRestClient
    {
        public Uri Uri { get; set; }
        private string UserDirectory { get; set; }
        private string UserId { get; set; }
        private string UserPassword { get; set; }
        private string _userDirectory;
        private string _userId;
        private string IssuerName;
        private X509Certificate2Collection _certificates;
        public readonly CookieContainer _cookieJar = new CookieContainer();

        public ConnectionType? CurrentConnectionType { get; private set; }

        public enum ConnectionType
        {
            NtlmUserViaProxy,
            DirectConnection
        }

        public RestClient(string uri, string userDomain = "", string userId = "", string userPassword = "")
        {
            Uri = new Uri(uri);
            if(uri.Contains("99")) IssuerName = "Qlik-dev";
            else IssuerName = "Qlik-prod";

            if (!String.IsNullOrEmpty(userDomain)) UserDirectory = userDomain;
            else UserDirectory = Environment.UserDomainName;
            if (!String.IsNullOrEmpty(userId)) UserId = userId;
            else userId = Environment.UserName;
            if (!String.IsNullOrEmpty(userPassword)) UserPassword = userPassword;
            else UserPassword = "";
            
        }

        public void AsDirectConnection( int port = 4242, bool certificateValidation = true, X509Certificate2Collection certificateCollection = null)
        {
            AsDirectConnection(UserDirectory, UserId, port, certificateValidation, certificateCollection);
        }
        public void AsDirectConnection(string userDirectory, string userId, int port = 4242, bool certificateValidation = true, X509Certificate2Collection certificateCollection = null)
        {
            CurrentConnectionType = ConnectionType.DirectConnection;
            var uriBuilder = new UriBuilder(Uri);
            uriBuilder.Port = port;
            Uri = uriBuilder.Uri;
            _userId = userId;
            _userDirectory = userDirectory;
            _certificates = certificateCollection;
            if (!certificateValidation)
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            //System.Windows.Forms.MessageBox.Show("2- Domain = " + _userDirectory + "\nUserId=" + _userId );
        }
       
        public void AsDirectConnection(bool isQPS = true, int port = 4243, bool certificateValidation = true, X509Certificate2Collection certificateCollection = null)
        {
            port = ChangeURIByAPI(isQPS);
            
            //Si pas de certificat, on le récupère dans le magasin
            if (certificateCollection == null)
            {
                // First locate the Qlik Sense client certificate
                X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
                store.Open(OpenFlags.ReadOnly);

                if(certificateCollection == null)
                {
                    certificateCollection = new X509Certificate2Collection();
                    foreach (X509Certificate2 certificate in store.Certificates)
                    {
                        if (certificate.FriendlyName == IssuerName) certificateCollection.Add(certificate);
                    }
                }

                store.Close();
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            }

            AsDirectConnection(UserDirectory, UserId, port, certificateValidation, certificateCollection);
        }
        public int ChangeURIByAPI(bool isQPS)
        {
            int port ;
            var urlBuilder = new UriBuilder(Uri.OriginalString);
            //Cas utilisation API proxy
            if (isQPS == true)
            {
                port = 4243;
                urlBuilder.Scheme = Uri.UriSchemeHttps;
            }
            //Cas utilisation autre API
            else
            {
                port = 4242;
                urlBuilder.Scheme = Uri.UriSchemeHttp;
            }

            Uri = new Uri(urlBuilder.Uri.OriginalString);            
            return port;
        }
        public void Test()
        {
            var client = new WebClient();
            client.UseDefaultCredentials = true;
            client.Headers.Add("User-Agent", "Windows");
            
            var dummyResponse = client.DownloadString(Uri + "/qmc"); // Used to collect cookie  
            client.Headers.Add("Cookie", client.ResponseHeaders[HttpResponseHeader.SetCookie]);
            var theUser = client.DownloadString(Uri + "/qps/user");
            Console.WriteLine(theUser);
        }
        public void Test2()
        {
            if (Impersonation.impersonateValidUser(UserId, UserDirectory, UserPassword))
            {
                var client = new WebClient();
                //client.UseDefaultCredentials = false;
                var urlBuilder = new UriBuilder(Uri.OriginalString);
                urlBuilder.Scheme = Uri.UriSchemeHttp;
                urlBuilder.Port = -1;
                var url = new Uri(urlBuilder.Uri.OriginalString);
                client.UseDefaultCredentials = true;
                client.Credentials = new System.Net.NetworkCredential(UserId, UserPassword, UserDirectory);
                client.Headers.Add("User-Agent", "Windows");
                var dummyResponse = client.DownloadString(url + "/hub"); // Used to collect cookie  
                client.Headers.Add("Cookie", client.ResponseHeaders[HttpResponseHeader.SetCookie]);
                var theUser = client.DownloadString(url + "/qps/user");
                Console.WriteLine(theUser);
            }
            Impersonation.undoImpersonation();
        }

        public void AsNtlmUserViaProxy()
        {
                //Force à utiliser une connexion http (non https + port)
                var urlBuilder = new UriBuilder(Uri.OriginalString);
                urlBuilder.Scheme = Uri.UriSchemeHttp;
                urlBuilder.Port = -1;
                Uri = new Uri(urlBuilder.Uri.OriginalString);
                Headers.Add("User-Agent", "Windows");

                UseDefaultCredentials = true;
                //UseDefaultCredentials = false;
                //Credentials = new System.Net.NetworkCredential(UserId, UserPassword, UserDirectory);

                CurrentConnectionType = ConnectionType.NtlmUserViaProxy;
                _userId = UserId;
                _userDirectory = UserDirectory;
        }

        public void LoadCertificateFromDirectory(string path, SecureString certificatePassword = null)
        {
            var clientCertPath = Path.Combine(path, "client.pfx");
            if (!Directory.Exists(path)) throw new DirectoryNotFoundException(path);
            if (!File.Exists(clientCertPath)) throw new FileNotFoundException(clientCertPath);
            var certificate = certificatePassword == null ? new X509Certificate2(clientCertPath) : new X509Certificate2(clientCertPath, certificatePassword);
            _certificates = new X509Certificate2Collection(certificate);
        }

        public string Get(string endpoint)
        {
            if (!Impersonation.impersonateValidUser(UserId, UserDirectory, UserPassword)) throw new ArgumentException("L'utilisateur indiqué n'est pas valide.\n Vérifier user/mdp.\n", "Utilisateur - mot de passe");
            else {
                //System.Windows.Forms.MessageBox.Show("10- GET\n_userDirectory = " + _userDirectory + "\n_userId=" + _userId + "\nEnvironment.UserDomainName=" + Environment.UserDomainName + "\nEnvironment.UserName=" + Environment.UserName);
                ValidateConfiguration();
                Encoding = Encoding.UTF8;
                var retour = DownloadString(new Uri(Uri, endpoint));
                Impersonation.undoImpersonation();
                return retour;
            }            
        }

        public Task<string> GetAsync(string endpoint)
        {
            ValidateConfiguration();
            return DownloadStringTaskAsync(new Uri(Uri, endpoint));
        }

        public string Post(string endpoint, string body)
        {
            if (!Impersonation.impersonateValidUser(UserId, UserDirectory, UserPassword)) throw new ArgumentException("L'utilisateur indiqué n'est pas valide.\n Vérifier user/mdp.\n", "Utilisateur - mot de passe");
            else
            {
                ValidateConfiguration();
                if (_cookieJar.Count == 0)  CollectCookie();
                var retour = UploadString(new Uri(Uri, endpoint), body);
                Impersonation.undoImpersonation();
                return retour;
            }
        }

        public async Task<string> PostAsync(string endpoint, string body)
        {
            ValidateConfiguration();
            if (_cookieJar.Count == 0)
                await CollectCookieAsync();
            return await UploadStringTaskAsync(new Uri(Uri, endpoint), body);
        }

        public string Delete(string endpoint)
        {
            if (!Impersonation.impersonateValidUser(UserId, UserDirectory, UserPassword)) throw new ArgumentException("L'utilisateur indiqué n'est pas valide.\n Vérifier user/mdp.\n", "Utilisateur - mot de passe");
            else
            {
                ValidateConfiguration();
                if (_cookieJar.Count == 0) // && !endpoint.ToUpper().Contains("QPS"))
                CollectCookie();
                var retour = UploadString(new Uri(Uri, endpoint), "DELETE", "");
                Impersonation.undoImpersonation();
                return retour;
            }
        }

        public async Task<string> DeleteAsync(string endpoint)
        {
            ValidateConfiguration();
            if (_cookieJar.Count == 0)
            await CollectCookieAsync();
            return await UploadStringTaskAsync(new Uri(Uri, endpoint), "DELETE", "");
        }

        public string Put(string endpoint, string body)
        {
            if (!Impersonation.impersonateValidUser(UserId, UserDirectory, UserPassword)) throw new ArgumentException("L'utilisateur indiqué n'est pas valide.\n Vérifier user/mdp.\n", "Utilisateur - mot de passe");
            else
            {
                ValidateConfiguration();
                if (_cookieJar.Count == 0) CollectCookie();
                var retour = UploadString(new Uri(Uri, endpoint), "PUT", body);
                Impersonation.undoImpersonation();
                return retour;
            }
        }

        private void ValidateConfiguration()
        {
            if (CurrentConnectionType == null) throw new ConnectionNotConfiguredException();
            if (CurrentConnectionType == ConnectionType.DirectConnection && _certificates == null)
                throw new CertificatesNotLoadedException();
        }

        private void CollectCookie()
        {
            Get("/qrs/about");
        }

        private async Task CollectCookieAsync()
        {
            await GetAsync("/qrs/about");
        }

        protected override WebRequest GetWebRequest(Uri address)
        {
            var xrfkey = CreateXrfKey();
            var request = (HttpWebRequest)base.GetWebRequest(AddXrefKey(address, xrfkey));
            request.Timeout = request.Timeout * 2;
            request.ContentType = "application/json";
            request.Headers.Add("X-Qlik-Xrfkey", xrfkey);
            var userHeaderValue = string.Format("UserDirectory={0};UserId={1}", _userDirectory, _userId);
            switch (CurrentConnectionType)
            {
                case ConnectionType.NtlmUserViaProxy:
                    request.Headers.Add("X-Qlik-User", userHeaderValue);
                    request.UserAgent = "Windows";
                    break;
                case ConnectionType.DirectConnection:
                    request.Headers.Add("X-Qlik-User", userHeaderValue);
                    foreach (var certificate in _certificates)
                    {
                        request.ClientCertificates.Add(certificate);
                    }
                    break;
            }
            request.CookieContainer = _cookieJar;
            return request;
        }

        private static Uri AddXrefKey(Uri uri, string xrfkey)
        {
            var query = uri.Query;
            query = string.IsNullOrEmpty(query) ? "" : query.Substring(1) + "&";
            query = query + "xrfkey=" + xrfkey;

            var uriBuilder = new UriBuilder(uri) { Query = query };
            return uriBuilder.Uri;
        }

        private static string CreateXrfKey()
        {
            const string allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var sb = new StringBuilder(16);
            using (var provider = new RNGCryptoServiceProvider())
            {
                var randomSequence = new byte[16];
                provider.GetBytes(randomSequence);
                foreach (var b in randomSequence)
                {
                    var character = allowedChars[b % allowedChars.Length];
                    sb.Append(character);
                }
            }
            return sb.ToString();
        }


        public class ConnectionNotConfiguredException : Exception
        {
        }

        public class CertificatesNotLoadedException : Exception
        {
        }
    }
}
