using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Drawing.Printing;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Caching;
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

                if (selectedSystem == "undefined" || selectedSystem == "" || selectedSystem == "null")
                {
                    selectedSystem = null;
                }
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
            List<FilterSTKCUSViewModel> result = new List<FilterSTKCUSViewModel>();
            try
            {
                List<GetSystwmModel> AllSystem = _homeService.GetSystemsName(null);

                List<GetSystwmModel> getSystem =_homeService.GetSystempartyearcycle(slectsystem);

                List<string> partNumbers = getSystem.Select(p => p.PartNum).ToList();

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

                //on hand qty 
                if (selectvalue == "onHandQty")
                {
                    try
                    {
                        result = _homeService.GetOnhandData(getSystem, transactionDetails, onHandQtyDict);

                    }
                    catch (Exception ex)
                    {
                        logService.AddLog(ex, "OnhandstkcycleFilter", "HomeController");
                    }
                }
                //stk to cus
                else if (selectvalue == "stkToCus")
                {
                    try
                    {
                        result = _homeService.GetSTKCUSData(getSystem, transactionDetails, onHandQtyDict);

                    }
                    catch (Exception ex)
                    {
                        logService.AddLog(ex, "OnhandstkcycleFilter", "HomeController");

                    }

                }
                //cycle time
                else if (selectvalue == "cycleTime")
                {
                    try
                    {
                        result = _homeService.GetCycletimeData(getSystem, transactionDetails, onHandQtyDict);

                    }
                    catch (Exception ex)
                    {
                        logService.AddLog(ex, "OnhandstkcycleFilter", "HomeController");
                    }
                }
                // Pagination
                List<FilterSTKCUSViewModel> mrgedata = result.Skip((page - 1) * pageSize).Take(pageSize).ToList();

                List<PrioritySummary> prioritySummaryList = result
                    .GroupBy(r => r.PriorityRank)
                    .Select(g => new PrioritySummary
                    {
                        Priority = g.Key,
                        TotalParts = g.Count(),
                        TotalPartsList = g.Select(x => x.PartNum).ToList()
                    }).OrderBy(p=>p.Priority)
                    .ToList();

                _Hmodel = new HomeModel<PartSummaryViewModel>
                {
                    FilterSTKCUSList = mrgedata,
                    SystemnameList = AllSystem,
                    Systemname = slectsystem,
                    FilterSTKCUSPriorityList = prioritySummaryList,
                    FilterName = selectvalue,
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

        public ActionResult GetPriorityModelData(string systemName, List<string> selectedPartNums)
        {
            if (systemName == "undefined" || systemName == "" || systemName == "null")
            {
                systemName = null;
            }
            HomeModel<PartSummaryViewModel> _Hmodel = new HomeModel<PartSummaryViewModel>();
            List<FilterSTKCUSViewModel> _Model = new List<FilterSTKCUSViewModel>();
            try
            {

                List<GetSystwmModel> getSystem = _homeService.GetSystempartyearcycle(systemName);

                List<string> partNumbers = getSystem.Select(p => p.PartNum).ToList();

                Dictionary<string, int> onHandQtyDict = EDB.PartWhses.Where(w => partNumbers.Contains(w.PartNum)).GroupBy(w => w.PartNum)
                    .ToDictionary(g => g.Key, g => g.Max(w => (int?)w.OnHandQty) ?? 0);

                _Model = getSystem
                .Where(sys => partNumbers.Contains(sys.PartNum))
                .Select(sys =>
                {
                    int onHandQty = onHandQtyDict.ContainsKey(sys.PartNum) ? onHandQtyDict[sys.PartNum] : 0;
                    int yearlyQty = sys?.Yearly_Qty ?? 0;
                    decimal cycleTime = sys?.Cycle_Time ?? 0;

                    decimal timeForMakingQty = ((yearlyQty - onHandQty) / 12.0m) * cycleTime;
                    decimal timeForMakingQtyDays = timeForMakingQty / 20.0m;

                    int priorityRankCalculated = timeForMakingQtyDays >= 300 ? 1 :
                                                 timeForMakingQtyDays >= 200 ? 2 :
                                                 timeForMakingQtyDays >= 150 ? 3 :
                                                 timeForMakingQtyDays >= 100 ? 4 : 5;
                        return new FilterSTKCUSViewModel
                        {
                            PartNum = sys.PartNum,
                            YearlyQty = yearlyQty,
                            OnHandQty = onHandQty,
                            CycleTime = cycleTime,
                            Priority_Score = timeForMakingQtyDays,
                            PriorityRank = priorityRankCalculated
                        };

                    
                }).Where(p => selectedPartNums.Contains(p.PartNum))
                                        .OrderBy(p => p.PriorityRank)
                                        .ThenByDescending(p => p.Priority_Score)
                                        .ToList();
                _Hmodel = new HomeModel<PartSummaryViewModel>
                {
                    FilterSTKCUSList = _Model,
                };

                return PartialView("_PriorityModelPopup" , _Hmodel);
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetPriorityModelData", "HomeController");
            }
            return PartialView("_PriorityModelPopup", _Hmodel);
        }
    }
}