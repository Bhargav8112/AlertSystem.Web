//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AlertSystem.DataBase
{
    using System;
    using System.Collections.Generic;
    
    public partial class Prodcution_Report_CNC
    {
        public int Id { get; set; }
        public int MID { get; set; }
        public int PID { get; set; }
        public string Production_ID { get; set; }
        public string Job_number { get; set; }
        public string Part_number { get; set; }
        public string Rev_No { get; set; }
        public string Op_No { get; set; }
        public string Machine_Name { get; set; }
        public string Machine_No { get; set; }
        public Nullable<System.DateTime> Upload_Date { get; set; }
        public Nullable<System.DateTime> Production_date { get; set; }
        public string Shift { get; set; }
        public string Operator { get; set; }
        public Nullable<bool> Deviation_Required { get; set; }
        public Nullable<bool> Request_for_ECR { get; set; }
        public Nullable<bool> Mafia { get; set; }
        public Nullable<bool> OPD { get; set; }
        public Nullable<bool> Operation_Sequence { get; set; }
        public Nullable<decimal> OK_Qty { get; set; }
        public Nullable<decimal> Reject_Qty { get; set; }
        public Nullable<decimal> Non_Conf_Qty { get; set; }
        public string Reason_for_rejection { get; set; }
        public Nullable<decimal> Total_Qty { get; set; }
        public Nullable<decimal> Plan_time { get; set; }
        public Nullable<decimal> Std_Setup_Time { get; set; }
        public Nullable<decimal> Std_Cycle_Time { get; set; }
        public Nullable<decimal> Actual_Setup_Time { get; set; }
        public Nullable<decimal> Actual_Cycle_Time { get; set; }
        public Nullable<decimal> Loading_Time { get; set; }
        public Nullable<decimal> Non_Productive_time { get; set; }
        public Nullable<decimal> Total_production_time { get; set; }
        public string Non_productive_check_person { get; set; }
        public Nullable<bool> setup_bin_fixuring { get; set; }
        public Nullable<decimal> Lot_Qty { get; set; }
        public string OP_Done { get; set; }
        public string status { get; set; }
        public string programmer { get; set; }
    }
}
