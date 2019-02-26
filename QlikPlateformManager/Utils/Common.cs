using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QlikPlateformManager.Utils
{
    public static class Common
    {
        //ListItem  : Renvoie le texte d'une valeur selectionnée
        public static string GetText(List<SelectListItem> myListItem, string mySelectedValue)
        {
            return myListItem.Where(x => x.Value == mySelectedValue).DefaultIfEmpty(new SelectListItem() { }).First().Text;
        }

    }
}