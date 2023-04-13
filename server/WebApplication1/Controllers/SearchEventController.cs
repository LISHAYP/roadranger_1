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
    public class SearchEventController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        // GET: api/SearchEvent
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/SearchEvent/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/SearchEvent
        public void Post([FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/post/searchByCountryNumber")]
        public IHttpActionResult SearchByCountryNumber([FromBody] EventDto countryNumber)
        {
            var events = db.tblEvents.Where(x => x.country_number == countryNumber.CountryNumber)
                                     .Select(x => new EventDto
                                     {
                                         eventNumber = x.eventNumber,
                                         Details = x.details,
                                         EventDate = x.event_date,
                                         EventTime = x.event_time,
                                         Latitude = x.latitude,
                                         Longitude = x.longitude,
                                         EventStatus = x.event_status,
                                         Picture = x.picture,
                                         TravelerId = x.travelerId,
                                         StackholderId = x.stackholderId,
                                         SerialTypeNumber = x.serialTypeNumber,
                                         CountryNumber = x.country_number,
                                         AreaNumber = x.area_number
                                     })
                                     .ToList();

            if (events.Count == 0)
            {
                return NotFound();
            }

            return Ok(events);
        }


        [HttpPost]
        [Route("api/post/searchByAreaNumber")]
        public IHttpActionResult SearchByAreaNumber([FromBody] EventDto areaNumber)
        {
            var events = db.tblEvents.Where(x => x.area_number == areaNumber.AreaNumber)
                                     .Select(x => new EventDto
                                     {
                                         eventNumber = x.eventNumber,
                                         Details = x.details,
                                         EventDate = x.event_date,
                                         EventTime = x.event_time,
                                         Latitude = x.latitude,
                                         Longitude = x.longitude,
                                         EventStatus = x.event_status,
                                         Picture = x.picture,
                                         TravelerId = x.travelerId,
                                         StackholderId = x.stackholderId,
                                         SerialTypeNumber = x.serialTypeNumber,
                                         CountryNumber = x.country_number,
                                         AreaNumber = x.area_number
                                     })
                                     .ToList();

            if (events.Count == 0)
            {
                return NotFound();
            }

            return Ok(events);
        }


        [HttpPost]
        [Route("api/post/searchBySerialTypeNumber")]
        public IHttpActionResult SearchBySerialTypeNumber([FromBody] EventDto serialTypeNumber)
        {
            var events = db.tblEvents.Where(x => x.serialTypeNumber == serialTypeNumber.SerialTypeNumber)
                                     .Select(x => new EventDto
                                     {
                                         eventNumber = x.eventNumber,
                                         Details = x.details,
                                         EventDate = x.event_date,
                                         EventTime = x.event_time,
                                         Latitude = x.latitude,
                                         Longitude = x.longitude,
                                         EventStatus = x.event_status,
                                         Picture = x.picture,
                                         TravelerId = x.travelerId,
                                         StackholderId = x.stackholderId,
                                         SerialTypeNumber = x.serialTypeNumber,
                                         CountryNumber = x.country_number,
                                         AreaNumber = x.area_number
                                     })
                                     .ToList();

            if (events.Count == 0)
            {
                return NotFound();
            }

            return Ok(events);
        }


        [HttpPost]
        [Route("api/post/searchByEventDate")]
        public IHttpActionResult SearchByEventDate([FromBody] EventDto eventDate)
        {
            var events = db.tblEvents.Where(x => x.event_date == eventDate.EventDate)
                                     .Select(x => new EventDto
                                     {
                                         eventNumber = x.eventNumber,
                                         Details = x.details,
                                         EventDate = x.event_date,
                                         EventTime = x.event_time,
                                         Latitude = x.latitude,
                                         Longitude = x.longitude,
                                         EventStatus = x.event_status,
                                         Picture = x.picture,
                                         TravelerId = x.travelerId,
                                         StackholderId = x.stackholderId,
                                         SerialTypeNumber = x.serialTypeNumber,
                                         CountryNumber = x.country_number,
                                         AreaNumber = x.area_number
                                     })
                                     .ToList();

            if (events.Count == 0)
            {
                return NotFound();
            }

            return Ok(events);
        }


        [HttpPost]
        [Route("api/post/searchByMultipleParameters")]
        public IHttpActionResult SearchByMultipleParameters([FromBody] EventDto searchParams)
        {
            var events = db.tblEvents.Where(x => x.country_number == searchParams.CountryNumber
                                               && x.area_number == searchParams.AreaNumber
                                               && x.serialTypeNumber == searchParams.SerialTypeNumber
                                               && x.event_date == searchParams.EventDate)
                                     .Select(x => new EventDto
                                     {
                                         eventNumber = x.eventNumber,
                                         Details = x.details,
                                         EventDate = x.event_date,
                                         EventTime = x.event_time,
                                         Latitude = x.latitude,
                                         Longitude = x.longitude,
                                         EventStatus = x.event_status,
                                         Picture = x.picture,
                                         TravelerId = x.travelerId,
                                         StackholderId = x.stackholderId,
                                         SerialTypeNumber = x.serialTypeNumber,
                                         CountryNumber = x.country_number,
                                         AreaNumber = x.area_number
                                     })
                                     .ToList();

            if (events.Count == 0)
            {
                return NotFound();
            }

            return Ok(events);
        }


        // PUT: api/SearchEvent/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/SearchEvent/5
        public void Delete(int id)
        {
        }
    }
}
