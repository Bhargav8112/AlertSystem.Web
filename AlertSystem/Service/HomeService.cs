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
    }
}