using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Drawing.Printing;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using AlertSystem.DataBase;
using AlertSystem.Models;
using AlertSystem.Service;

namespace AlertSystem.Controllers
{
    public class HomeController : Controller
    {
        logService logService = new logService();
        HomeService _homeService = new HomeService();
        ITEIndiaEntities DB = new ITEIndiaEntities();
        SaaS1143_62653Entities EDB = new SaaS1143_62653Entities();

        public ActionResult Index(string selectedSystem, int page = 1)
        {
            int pageSize = 20;
            HomeModel<PartSummaryViewModel> _Hmodel = new HomeModel<PartSummaryViewModel>();
            try
            {

                List<GetSystwmModel> getSystwm = _homeService.GetSystemsName(null);

                List<PartSummaryViewModel> PartWiseData = (from _model in DB.usp_GetPartSummary(selectedSystem)
                                      select new PartSummaryViewModel
                                      {
                                          PartNum = _model.PartNum,
                                          TotalOnHandQtyFL = _model.TotalOnHandQtyFL,
                                          TotalYearlyQty = _model.TotalYearlyQty,
                                          TotalCycleTime = _model.TotalCycleTime,
                                      })
                                      .Skip((page - 1) * pageSize)
                                        .Take(pageSize)
                                        .ToList();

                int? SumOnHandQtyFL = DB.usp_GetPartSummary(selectedSystem).Sum(x => x.TotalOnHandQtyFL);
                int? SumYearlyQty = DB.usp_GetPartSummary(selectedSystem).Sum(x => x.TotalYearlyQty);

               int totalItems = DB.usp_GetPartSummary(selectedSystem).Count();

                _Hmodel = new HomeModel<PartSummaryViewModel>
                {
                    Items = PartWiseData,
                    SystemnameList = getSystwm,
                    SumOnHandQtyFL = SumOnHandQtyFL,
                    SumYearlyQty = SumYearlyQty,
                    PageNumber = page,
                    PageSize = pageSize,
                    TotalItems = totalItems,
                    Systemname = selectedSystem
                };
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "Index", "HomeController");
            }
            return View(_Hmodel);
        }

        // on hand qty stk to cus and cycle time filter
        public ActionResult OnhandstkcycleFilter(string selectvalue,string slectsystem, int page = 1)
        {
            DateTime filterDate = new DateTime(2025, 1, 1);
            slectsystem = slectsystem != "" ? slectsystem : null;
            int pageSize = 20;
            HomeModel<PartSummaryViewModel> _Hmodel = new HomeModel<PartSummaryViewModel>();
            try
            {
                List<GetSystwmModel> getSystwm = DB.Production_System_Name.Where(p => string.IsNullOrEmpty(slectsystem) || p.SystemNum == slectsystem)
                      .Select(p => new GetSystwmModel
                      {
                          PartNum = p.PartNum,
                          Yearly_Qty = p.Yearly_Qty,
                          Cycle_Time = p.Cycle_Time
                      })
                      .Distinct()
                      .ToList();
                List<string> partNumbers = getSystwm.Select(p => p.PartNum).ToList();

                List<TransactionSummary> transactionDetails = EDB.PartTrans.Where(p => partNumbers.Contains(p.PartNum)
                                    && p.TranType == "STK-CUS"
                                    && p.TranDate > filterDate
                                    && p.Company == "SSW")
                    .GroupBy(p => new { p.Company, p.PartNum, p.TranType })
                    .Select(group => new TransactionSummary
                    {
                        Company = group.Key.Company,
                        PartNum = group.Key.PartNum,
                        TranType = group.Key.TranType,
                        TotalQty = group.Sum(p => p.TranQty)
                    }).ToList();

                Dictionary<string, int> onHandQtyDict = EDB.PartWhses.Where(w => partNumbers.Contains(w.PartNum)).GroupBy(w => w.PartNum)
                    .ToDictionary(g => g.Key, g => g.Max(w => (int?)w.OnHandQty) ?? 0);

                    List<FilterSTKCUSViewModel> result = getSystwm.Select((GetSystwmModel part) =>
                    {
                        TransactionSummary trans = transactionDetails
                            .FirstOrDefault((TransactionSummary t) => t.PartNum == part.PartNum);
                        int onHandQty = onHandQtyDict.ContainsKey(part.PartNum) ? onHandQtyDict[part.PartNum] : 0;
                        double monthsInStock = (part.Yearly_Qty.GetValueOrDefault() > 0)? onHandQty / ((double)part.Yearly_Qty.GetValueOrDefault() / 12): 0;
                        int rank = monthsInStock >= 12 ? 5 :
                                   monthsInStock >= 9 ? 4 :
                                   monthsInStock >= 6 ? 3 :
                                   monthsInStock >= 3 ? 2 : 1;
                        return new FilterSTKCUSViewModel
                        {
                            PartNum = part.PartNum,
                            Company = trans != null ? trans.Company : "SSW",
                            TranType = trans != null ? trans.TranType : "N/A",
                            TotalTranQty = trans != null ? trans.TotalQty : 0,
                            OnHandQty = onHandQty,
                            YearlyQty = part.Yearly_Qty ?? 0,
                            CycleTime = part.Cycle_Time ?? 0,
                            MonthsInStock = monthsInStock,
                            PriorityRank = rank
                        };
                    }).ToList();

                List<FilterSTKCUSViewModel> mrgedata = result.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                List<PrioritySummary> prioritySummaryList = result
                    .GroupBy(r => r.PriorityRank)
                    .Select(g => new PrioritySummary
                    {
                        Priority = g.Key,
                        TotalParts = g.Count()
                    }).OrderBy(p=>p.Priority)
                    .ToList();

                _Hmodel = new HomeModel<PartSummaryViewModel>
                {
                    FilterSTKCUSList = mrgedata,
                    SystemnameList = getSystwm,
                    Systemname = slectsystem,
                    FilterSTKCUSPriorityList = prioritySummaryList,
                    PageNumber = page,
                    PageSize = pageSize,
                    TotalItems = result.Count()
                };
                if (Request.IsAjaxRequest())
                {
                    return PartialView("SubIndex", _Hmodel);  
                }
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "OnhandstkcycleFilter", "HomeController");
            }
            return View("SubIndex", _Hmodel);
        }
    }
}