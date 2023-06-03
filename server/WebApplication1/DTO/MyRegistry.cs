using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FluentScheduler;


namespace WebApplication1.DTO
{
    public class MyRegistry: Registry
    {
        public MyRegistry()
        {
           // IJob task = new MyTask();
           // JobManager.AddJob(task);
            Schedule<MyTask>().ToRunNow().AndEvery(5).Seconds();
        }
    }
}