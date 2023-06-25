using FluentScheduler;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebApplication1.Controllers;
using WebApplication1.DTO;

namespace WebApplication1
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        //code for timer
        static Timer timer = new Timer();
        EventDto PNevent = new EventDto();
        private static EventTimer _eventTimer;


        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            json.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            JobManager.Initialize(new MyRegistry());

            //code for timer
            //timer.Interval = 5000;
            //timer.Elapsed += tm_Tick;

            _eventTimer = new EventTimer();
            _eventTimer.Start();

        }
        //code for timer
        private void tm_Tick(object sender, ElapsedEventArgs e)
        {
            EndTimer();
            //var timerServices = new TimerServices();
            //timerServices.SendPushForEvent(PNevent);
        }

        //code for timer
        public static void StartTimer()
        {
            timer.Enabled = true;

        }
        public static void EndTimer()
        {
            timer.Enabled = false;

        }

        protected void Application_End()
        {
            _eventTimer.Stop();
        }
    }
}
