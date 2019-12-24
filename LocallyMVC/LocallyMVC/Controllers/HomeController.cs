using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LocallyMVC.Models;

namespace LocallyMVC.Controllers
{
    public class HomeController : Controller
    {
        public DbCompiledModel LocallyDBEntities { get; private set; }

        LocallyDBEntities lDbE = new LocallyDBEntities();

        public ActionResult Index()
        {
             return View(lDbE.SlidersTables.ToList());
        }

        public ActionResult About()
        {    

            return View(lDbE.TeammembersTables.ToList());
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Places()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Detail()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult AdminContact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Test()
        {
           
            return View(lDbE.SlidersTables.ToList());
        }

        
      
    }
}