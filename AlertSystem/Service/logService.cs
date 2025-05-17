using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AlertSystem.DataBase;

namespace AlertSystem.Service
{
	public class logService
	{
        ITEIndiaEntities DB = new ITEIndiaEntities();
        public void AddLog(Exception ex, string methodname, string page)
        {
            int LNO = GetLineNumber(ex);


            Production_LogTable _Production_LogTable = new Production_LogTable();

            _Production_LogTable.Message = ex.ToString();
            _Production_LogTable.LineNumber = LNO;
            _Production_LogTable.CurrentDateTime = DateTime.Now;
            _Production_LogTable.PageName = page;
            _Production_LogTable.MethodName = methodname;
            _Production_LogTable.Active = true;
            _Production_LogTable.Deleted = false;

            DB.Production_LogTable.Add(_Production_LogTable);
            DB.SaveChanges();

        }

        private int GetLineNumber(Exception exception)
        {
            if (exception.StackTrace != null)
            {
                var stackTrace = new System.Diagnostics.StackTrace(exception, true);
                foreach (var frame in stackTrace.GetFrames())
                {
                    int lineNumber = frame.GetFileLineNumber();
                    if (lineNumber != 0)
                    {
                        return lineNumber;
                    }
                }
            }
            return 0;
        }
    }
}