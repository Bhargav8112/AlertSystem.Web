using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AlertSystem.Models;
using System.Web.Security;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using AlertSystem.DataBase;
using AlertSystem.Service;

namespace AlertSystem.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        ITEIndiaEntities DB = new ITEIndiaEntities();
        logService logService = new logService();

        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login(LoginModel _Model)
        {
            string username = _Model.UserName;
            string password = _Model.Password;
            try
            {
                USER_MST _user = DB.USER_MST.FirstOrDefault(p => p.TenentID == 10 && p.PASSWORD_CHNG == password && p.LOGIN_ID.Contains(username));
                Production_Report_Generator_Detail user = null;

                if (_user == null)
                {
                    user = DB.Production_Report_Generator_Detail.FirstOrDefault(p => p.User_Name == username && p.Password == password);
                }

                if (_user != null || user != null)
                {
                    var currentUser = _user ?? (object)user;

                    Session["userid"] = _user != null ? _user.USER_ID : user.PersonID;
                    Session["Username"] = username;
                    Session["name"] = _user != null ? _user.FIRST_NAME : user.User_Name;
                    Session["password"] = password;
                    Session["pic"] = "http://192.168.1.97/pic/" + (_user != null ? _user.personID : user.PersonID) + ".jpg";

                    FormsAuthentication.SetAuthCookie(_Model.UserName, false);

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return RedirectToAction("Index", "Account");
                }
            }
            catch (Exception ex)
            {
                logService.AddLog(ex, "Login", "AccountController");
            }
            return RedirectToAction("Index", "Account");
        }
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            return RedirectToAction("Index", "Account");

        }
    }
}