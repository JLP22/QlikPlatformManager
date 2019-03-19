using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace QlikPlatformManager
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //Initialisation BDD soit ici, soit web.config, balise <Context>
            //IDatabaseInitializer<QPMContext> init = new QPMInitializer();
            //Database.SetInitializer(init);
            //init.InitializeDatabase(new QPMContext());
        }
    }
}
