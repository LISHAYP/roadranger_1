using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class TimerController : ApiController
    {
        //code for timer
        [HttpGet]
        [Route("api/start")]
        public void StartTimer()
        {
            WebApiApplication.StartTimer();
        }

        [HttpPost]
        [Route("api/timer/sendpushforevent")]
        public IHttpActionResult SendPushForEvent(EventDto eventDto)
        {
            var timerServices = new TimerServices();
            timerServices.SendPushForEvent(eventDto);
            return Ok();

        }

        //code for timer
        [HttpGet]
        [Route("api/stop")]
        public void StopTimer()
        {
            WebApiApplication.EndTimer();
        }
    }
}
