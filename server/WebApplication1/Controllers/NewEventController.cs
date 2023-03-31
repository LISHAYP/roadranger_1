using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class NewEventController : ApiController
    {
        igroup190_test1Entities2 db = new igroup190_test1Entities2();

        // GET: api/NewEvent
        public IEnumerable<EventDto> Get()
        {
            List<tblEvent> events = db.tblEvents.ToList();
            List<EventDto> eventsDto= new List<EventDto>();

            foreach (var newevent in events)
            {
                EventDto eventDto = new EventDto
                {
                    EventNumber = newevent.eventNumber,
                    Details= newevent.details,
                    EventDate = newevent.event_date,
                    EventTime = newevent.event_time,
                    Latitude = newevent.latitude,
                    Longitude = newevent.longitude,
                    EventStatus= newevent.event_status,
                    Picture= newevent.picture,
                    TravelerId = newevent.travelerId,
                    StackholderId = newevent.stackholderId,
                    SerialTypeNumber = newevent.serialTypeNumber,
                    CountryNumber = newevent.country_number,
                    AreaNumber= newevent.area_number
                };
                eventsDto.Add(eventDto);
            }
            return eventsDto;
        }

        // GET: api/NewEvent/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/NewEvent
        [HttpPost]
        [Route("api/post/newevent")]
        public IHttpActionResult Post([FromBody]tblEvent value)
        {
            try
            {
                tblEvent NewEvent = new tblEvent
                {
                    details = value.details,
                    event_date = value.event_date,
                    event_time = value.event_time,
                    latitude = value.latitude,
                    longitude = value.longitude,
                    event_status = value.event_status,
                    picture = value.picture,
                    travelerId = value.travelerId,
                    stackholderId = value.stackholderId,
                    serialTypeNumber = value.serialTypeNumber,
                    country_number = value.country_number,
                    area_number = value.area_number

                };
                db.tblEvents.Add(NewEvent);
                db.SaveChanges();
                return Ok("New event created successfully!");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/NewEvent/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/NewEvent/5
        public void Delete(int id)
        {
        }
    }
}
