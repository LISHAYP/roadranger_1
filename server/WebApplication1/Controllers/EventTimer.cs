using data;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class EventTimer
    {
        private Timer _timer;
        private readonly TimeSpan _interval = TimeSpan.FromSeconds(5);
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();
        igroup190_test1Entities db = new igroup190_test1Entities();

        public void Start()
        {
            _timer = new Timer(Execute, null, TimeSpan.Zero, _interval);
        }

        public void Stop()
        {
            _timer?.Dispose();
        }

        private void Execute(object state)
        {
            try
            {
                using (var db = new igroup190_test1Entities())
                {
                    var activeEvents = db.tblEvents.Where(e => e.event_status == true).ToList();

                    foreach (var activeEvent in activeEvents)
                    {
                        // Retrieve the necessary event information
                        var eventDto = new EventDto
                        {
                            eventNumber = activeEvent.eventNumber,
                            Latitude = activeEvent.latitude,
                            Longitude = activeEvent.longitude,
                            SerialTypeNumber = activeEvent.serialTypeNumber,
                            TravelerId = activeEvent.travelerId,
                        };

                        // Send push notifications to all users for the active event
                        var timerServices = new TimerServices();
                        timerServices.SendPushForEvent(eventDto);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Error occurred during event processing.");
            }
        }
    }
}