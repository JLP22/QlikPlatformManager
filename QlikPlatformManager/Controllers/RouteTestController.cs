using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Routing;

namespace QlikPlatformManager.Controllers
{
    public class RouteTestController : IRouteConstraint
    {
        public bool Match(HttpContextBase httpContext, Route route, string parameterName, RouteValueDictionary values, RouteDirection routeDirection)
        {

            string action = values["action"] as string;
            action = char.ToUpper(action[0]) + action.Substring(1);
            string controller = values["controller"] as string;
            controller = char.ToUpper(controller[0]) + controller.Substring(1);
            string nameSpace = this.GetType().Namespace;
            //var controllerFullName = string.Format("OC_eBibliotheque.Controllers.{0}Controller", controller);
            var controllerFullName = string.Format("{0}.{1}Controller", nameSpace, controller);
            //var controllerFullName = NameSpace + "." + controller;

            var cont = Assembly.GetExecutingAssembly().GetType(controllerFullName);

            return cont != null && cont.GetMethod(action) != null;
        }
    }
}