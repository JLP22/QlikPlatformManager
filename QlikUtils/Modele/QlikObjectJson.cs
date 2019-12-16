using Qlik.Engine;
using Qlik.Sense.Client.Visualizations;
using System.Collections.Generic;

namespace QlikUtils
{
    public class QlikObjectJson
    {

        //----------------------------------------------------
        // Définition des structures de modèle JSON
        //----------------------------------------------------

        public class QRSUser
        {
            public string id { get; set; }
            public string userId { get; set; }
            public string userName { get; set; }
            public string userDirectory { get; set; }
            public IList<string> privileges { get; set; }
            public bool inactive { get; set; }
        }
        public class QEngineHealth
        {
            public string version { get; set; }
            public string started { get; set; }
            public QEMem mem { get; set; }
            public QECpu cpu { get; set; }
            public QESession session { get; set; }
            //public QEApps apps { get; set; }
            public QEUsers users { get; set; }
            public QECache cache { get; set; }
        }
        public class QEMem
        {
            public string committed { get; set; }
            public string allocated { get; set; }
            public string free { get; set; }
        }
        public class QECpu
        {
            public string total { get; set; }
        }
        public class QESession
        {
            public string active { get; set; }
            public string total { get; set; }
        }
        public class QEApps
        {
            public string active_docs { get; set; }
            public string in_memory_docs { get; set; }
            public string loaded_docs { get; set; }
            public string calls { get; set; }
            public string selections { get; set; }
        }
        public class QEUsers
        {
            public string active { get; set; }
            public string total { get; set; }
        }
        public class QECache
        {
            public string hits { get; set; }
            public string lookups { get; set; }
            public string added { get; set; }
            public string replaced { get; set; }
            public string bytes_added { get; set; }
        }

        public class QPSSessionUser
        {
            public string UserDirectory { get; set; }
            public string userId { get; set; }
            //public IList<string> Attributes { get; set; }
            public string SessionId { get; set; }
        }
        class QRSImportPost
        {
            public string name { get; set; }
        }
        public class QRSOwnerJson
        {
            public string id { get; set; }
            public string userId { get; set; }
            public string userDirectory { get; set; }
            public string name { get; set; }
            public IList<string> privileges { get; set; }
        }
        ///qrs/app/object/full
        public class QRSAppObjectJson
        {
            public string id { get; set; }
            public string modifiedDate { get; set; }
            public string name { get; set; }
            public string objectType { get; set; }
            public QRSStreamOwnerJson owner { get; set; }
        }
        ///qrs/app/copy
        public class QRSAppCopyJson
        {
            //public IList<string> customProperties { get; set; }
            public QRSOwnerJson owner { get; set; }
            public string name { get; set; }
            public string appId { get; set; }
            public string publishTime { get; set; }
            public bool published { get; set; }
            public IList<string> tags { get; set; }
            public QRSAppCopyStreamJson stream { get; set; }
            public string fileSize { get; set; }
            public IList<string> privileges { get; set; }
            public string id { get; set; }
        }

        public class QRSStreamJson
        {
            public string id { get; set; }
            public string createdDate { get; set; }
            public string modifiedDate { get; set; }
            public string modifiedByUserName { get; set; }
            public QRSStreamOwnerJson owner { get; set; }
            public string name { get; set; }
        }
        public class QRSStreamOwnerJson
        {
            public string id { get; set; }
            public string userId { get; set; }
            public string userDirectory { get; set; }
            public string name { get; set; }
        }
        public class QRSAppCopyStreamJson
        {
            public string id { get; set; }
            public string name { get; set; }
        }
        //qrs/app/hublist/full
        public class QRSHubListFullJson
        {
            public string id { get; set; }
            public string createdDate { get; set; }
            public string modifiedDate { get; set; }
            public string modifiedByUserName { get; set; }
            //public IList<string> customProperties { get; set; }
            public QRSOwnerJson owner { get; set; }
            public string name { get; set; }
            public string title { get; set; }
            public string appId { get; set; }
            public string sourceAppId { get; set; }
            public string targetAppId { get; set; }
            public string publishTime { get; set; }
            public bool published { get; set; }
            public IList<string> tags { get; set; }
            public string description { get; set; }
            public QRSHubListStreamJson stream { get; set; }
            public string fileSize { get; set; }
            public string lastReloadTime { get; set; }
            public string thumbnail { get; set; }
            public string savedInProductVersion { get; set; }
            public string migrationHash { get; set; }
            public string dynamicColor { get; set; }
            public string availabilityStatus { get; set; }
            public IList<string> privileges { get; set; }
            public string schemaPath { get; set; }
        }
        public class QRSHubListStreamJson
        {
            public string id { get; set; }
            public string name { get; set; }
            public string privileges { get; set; }
        }
        //"/QRS/app/{strAppID }"
        public class QRSMyTicket
        {
            public string value { get; set; }
        }
        //"/qrs/app/{id}/export/{token}
        public class QRSAppExportStep1
        {
            public string exportToken { get; set; }
            public string appId { get; set; }
            public string downloadPath { get; set; }
            public string cancelled { get; set; }
            public string schemaPath { get; set; }
        }
    }
}
