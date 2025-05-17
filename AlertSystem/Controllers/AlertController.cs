using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AlertSystem.DataBase;
using AlertSystem.Models;

namespace AlertSystem.Controllers
{
    public class AlertController : Controller
    {
        // GET: Alert
        ITEIndiaEntities DB = new ITEIndiaEntities();
        public ActionResult Index(int page = 1, int pageSize = 10)
        {
            int totalItems = DB.Production_System_Name.Count(); // Example

            List<Production_System_Name> data = DB.Production_System_Name
                         .OrderBy(e => e.ID)
                         .Skip((page - 1) * pageSize)
                         .Take(pageSize)
                         .ToList();

            //List<ProductionSystemNameViewModel> viewModelList = data.Select(d => new ProductionSystemNameViewModel
            //{
            //    Id = d.ID,
            //    systemname = d.SystemNum
            //}).ToList();

            //PagedResult<ProductionSystemNameViewModel> model = new PagedResult<ProductionSystemNameViewModel>
            //{
            //    Items = viewModelList,
            //    PageNumber = page,
            //    PageSize = pageSize,
            //    TotalItems = totalItems
            //};
            return View();
        }
    }
}