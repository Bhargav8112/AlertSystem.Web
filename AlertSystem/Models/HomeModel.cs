using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AlertSystem.Models
{
    public class HomeModel<T>
    {
        public List<T> Items { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public List<GetSystwmModel> SystemnameList { get; set; }
        public string Systemname { get; set; }
        public string FilterName { get; set; }

        public int TotalPages => (int)Math.Ceiling((decimal)TotalItems / PageSize);

        public int? SumOnHandQtyFL { get; set; }
        public int? SumYearlyQty { get; set; }
        public List<FilterSTKCUSViewModel> FilterSTKCUSList { get; set; }
        public List<PrioritySummary> FilterSTKCUSPriorityList { get; set; }
    }


    public class GetSystwmModel
    {
        public string SystemNum { get; set; }
        public string PartNum { get; set; }
        public int? Complexity { get; set; }
        public int? Priority { get; set; }
        public string Part_Type { get; set; }
        public int? Yearly_Qty { get; set; }
        public int? FL_Stock { get; set; }
        public int? SN_Stock { get; set; }
        public int? Rev { get; set; }
        public decimal? Cycle_Time { get; set; }
    }
    public class PartSummaryViewModel
    {
        public string PartNum { get; set; }
        public int? TotalOnHandQtyFL { get; set; }
        public int? TotalYearlyQty { get; set; }
        public decimal? TotalCycleTime { get; set; }
    }

    public class TransactionSummary
    {
        public string Company { get; set; }
        public string PartNum { get; set; }
        public string TranType { get; set; }
        public decimal TotalQty { get; set; }
    }

    public class FilterSTKCUSViewModel
    {
        public string PartNum { get; set; }
        public string Company { get; set; }
        public string TranType { get; set; }
        public decimal TotalTranQty { get; set; }
        public int OnHandQty { get; set; }
        public decimal YearlyQty { get; set; }
        public double WeeklyQty { get; set; }
        public double MonthlyQty { get; set; }
        public decimal CycleTime { get; set; }
        public double MonthsInStock { get; set; }
        public int PriorityRank { get; set; }
        public decimal Priority_Score { get; set; }
        public double prioritymonth { get; set; }
        public double WeeklyUsagePercentage { get; set; }

    }

    public class PrioritySummary
    {
        public int Priority { get; set; }
        public int TotalParts { get; set; }
        public List<string> TotalPartsList { get; set; }
    }
}