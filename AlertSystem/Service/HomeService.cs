using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AlertSystem.DataBase;
using AlertSystem.Models;
using AlertSystem.Service;

namespace AlertSystem.Controllers
{
	public class HomeService
	{
        ITEIndiaEntities DB = new ITEIndiaEntities();
        logService logService = new logService();

        public List<GetSystwmModel> GetSystemsName(string systemname)
        {
            try
            {
                    return DB.Production_System_Name .Where(p => string.IsNullOrEmpty(systemname) || p.SystemNum == systemname)
                        .Select(p => p.SystemNum)
                        .Distinct()
                        .Select(s => new GetSystwmModel { SystemNum = s })
                        .ToList();
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetSystemsName", "HomeService");

            }
            return null;
        }


        public List<GetSystwmModel> GetSystempartyearcycle(string systemname)
        {
            try
            {
                return DB.Production_System_Name.Where(p => string.IsNullOrEmpty(systemname) || p.SystemNum == systemname)
                      .Select(p => new GetSystwmModel
                      {
                          PartNum = p.PartNum,
                          Yearly_Qty = p.Yearly_Qty,
                          Cycle_Time = p.Cycle_Time
                      })
                      .Distinct()
                      .ToList();
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetSystempartyearcycle", "HomeService");

            }
            return null;
        }


        public List<FilterSTKCUSViewModel> GetOnhandData(List<GetSystwmModel> getSystem, List<TransactionSummary> transactionDetails, Dictionary<string, int> onHandQtyDict)
        {

            List<FilterSTKCUSViewModel> result = new List<FilterSTKCUSViewModel>();
            try
            {
                result = getSystem.Select((GetSystwmModel part) =>
                {
                    TransactionSummary trans = transactionDetails
                        .FirstOrDefault((TransactionSummary t) => t.PartNum == part.PartNum);
                    int onHandQty = onHandQtyDict.ContainsKey(part.PartNum) ? onHandQtyDict[part.PartNum] : 0;
                    double monthsInStock = (part.Yearly_Qty.GetValueOrDefault() > 0) ? onHandQty / ((double)part.Yearly_Qty.GetValueOrDefault() / 12) : 0;
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
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetFilterData", "HomeService");

            }

            return result;

        }

        public List<FilterSTKCUSViewModel> GetSTKCUSData(List<GetSystwmModel> getSystem, List<TransactionSummary> transactionDetails, Dictionary<string, int> onHandQtyDict)
        {

            List<FilterSTKCUSViewModel> result = new List<FilterSTKCUSViewModel>();
            try
            {
                result = (from sys in getSystem
                          join trans in transactionDetails
                             on sys.PartNum equals trans.PartNum into transGroup
                          from trans in transGroup.DefaultIfEmpty()
                          let onHandQty = onHandQtyDict.ContainsKey(sys.PartNum) ? onHandQtyDict[sys.PartNum] : 0
                          let yearlyQty = sys?.Yearly_Qty ?? 0
                          let tranQty = trans?.TotalQty ?? 0

                          let monthlyQty = (yearlyQty > 0) ? (double)yearlyQty / 12 : 0
                          let weeklyQty = (yearlyQty > 0) ? (double)yearlyQty / 52 : 0

                          let weeklyUsagePercentage = (weeklyQty > 0) ? ((double)tranQty / weeklyQty) * 100 : 0

                          let priorityRank = (weeklyUsagePercentage >= 150) ? 1 :
                                             (weeklyUsagePercentage >= 100) ? 2 :
                                             (weeklyUsagePercentage >= 80) ? 3 :
                                             (weeklyUsagePercentage >= 50) ? 4 :
                                             5

                          select new FilterSTKCUSViewModel
                          {
                              Company = trans?.Company ?? "SSW",
                              PartNum = sys.PartNum,
                              TranType = trans?.TranType ?? "N/A",
                              TotalTranQty = tranQty,
                              OnHandQty = onHandQty,
                              YearlyQty = yearlyQty,
                              WeeklyQty = weeklyQty,
                              MonthlyQty = monthlyQty,
                              CycleTime = sys?.Cycle_Time ?? 0,
                              WeeklyUsagePercentage = weeklyUsagePercentage,
                              PriorityRank = priorityRank
                          }).ToList();
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetFilterData", "HomeService");

            }

            return result;

        }
        

        public List<FilterSTKCUSViewModel> GetCycletimeData(List<GetSystwmModel> getSystem, List<TransactionSummary> transactionDetails, Dictionary<string, int> onHandQtyDict)
        {

            List<FilterSTKCUSViewModel> result = new List<FilterSTKCUSViewModel>();
            try
            {
                result = (
                            from sys in getSystem
                            join trans in transactionDetails
                                on sys.PartNum equals trans.PartNum into transGroup
                            from trans in transGroup.DefaultIfEmpty()
                            let onHandQty = onHandQtyDict.ContainsKey(sys.PartNum) ? onHandQtyDict[sys.PartNum] : 0
                            let yearlyQty = sys.Yearly_Qty ?? 0
                            let tranQty = trans != null ? trans.TotalQty : 0
                            let cycleTime = sys.Cycle_Time ?? 0
                            let priorityScore = (cycleTime * 0.5m)
                                                + (Math.Max(0, yearlyQty - onHandQty) * 0.3m)
                                                + (tranQty * 0.2m)
                            let priorityMonth = yearlyQty > 0 ? (onHandQty / ((double)yearlyQty / 12.0)) : 0
                            let priorityScoreByMonth = (((double)yearlyQty * priorityMonth / 12.0) - (double)onHandQty) * (double)cycleTime
                            let priorityRank = priorityScore >= 120 ? 1 :
                                               priorityScore >= 90 ? 2 :
                                               priorityScore >= 60 ? 3 :
                                               priorityScore >= 30 ? 4 : 5
                            select new FilterSTKCUSViewModel
                            {
                                Company = trans != null ? trans.Company : "SSW",
                                PartNum = sys.PartNum,
                                TranType = trans != null ? trans.TranType : "N/A",
                                TotalTranQty = tranQty,
                                OnHandQty = onHandQty,
                                YearlyQty = yearlyQty,
                                CycleTime = cycleTime,
                                Priority_Score = priorityScore,
                                prioritymonth = priorityMonth,
                                PriorityRank = priorityRank
                            }).ToList();
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "GetFilterData", "HomeService");

            }

            return result;

        }
    }
}