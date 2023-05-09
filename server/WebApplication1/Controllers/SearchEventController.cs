using data;
using NLog;
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
        private static Logger logger = LogManager.GetCurrentClassLogger();

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
        public void Post([FromBody] string value)
        {
        }

        [HttpPost]
        [Route("api/post/searchByCountryNumber")]
        public IHttpActionResult SearchByCountryNumber([FromBody] EventDto countryNumber)
        {
            try
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
                    logger.Error($"event not found in this country {countryNumber.CountryNumber}");
                    return NotFound();
                }

                return Ok(events);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }

        }


        [HttpPost]
        [Route("api/post/searchByAreaNumber")]
        public IHttpActionResult SearchByAreaNumber([FromBody] EventDto areaNumber)
        {
            try
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
                    logger.Error($"event not found in this area {areaNumber.AreaNumber}");
                    return NotFound();
                }

                return Ok(events);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }

        }


        [HttpPost]
        [Route("api/post/searchBySerialTypeNumber")]
        public IHttpActionResult SearchBySerialTypeNumber([FromBody] EventDto serialTypeNumber)
        {
            try
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
                    logger.Error($"event not found of this serial type number {serialTypeNumber.SerialTypeNumber}");

                    return NotFound();
                }

                return Ok(events);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }

        }


        [HttpPost]
        [Route("api/post/searchByEventDate")]
        public IHttpActionResult SearchByEventDate([FromBody] EventDto eventDate)
        {
            try
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
                    logger.Error($"event not found in this date {eventDate.EventDate} ");

                    return NotFound();
                }

                return Ok(events);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }


        [HttpPost]
        [Route("api/post/searchByMultipleParameters")]
        public IHttpActionResult SearchByMultipleParameters([FromBody] EventDto searchParams)
        {
            try
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
                    logger.Info($"events with these parameters were not found: country number: {searchParams.CountryNumber}, area number: {searchParams.AreaNumber}, serial type number: {searchParams.SerialTypeNumber}, event date: {searchParams.EventDate} ");
                    return NotFound();
                }

                return Ok(events);
            }
            catch (Exception ex) {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("api/post/searchByParameters")]
        public IHttpActionResult SearchByParameters([FromBody] List<EventParam> searchParams, int? countryNumber = null, DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {

                if (searchParams == null)
                {
                    // Return a BadRequest response to indicate that the caller did not provide valid search parameters
                    return BadRequest("Invalid search parameters");
                }

                var events = db.tblEvents.AsQueryable();

                if (countryNumber != null)
                {
                    // Filter areas based on selected country
                    events = events.Where(x => x.country_number == countryNumber);

                }

                foreach (var param in searchParams)
                {
                    switch (param.Name.ToLower())
                    {
                        case "countrynumber":
                            if (int.TryParse(param.Value, out var cn))
                            {
                                countryNumber = cn;
                                events = events.Where(x => x.country_number == countryNumber);
                            }
                            break;
                        case "areanumber":
                            if (int.TryParse(param.Value, out var areaNumber))
                            {
                                events = events.Where(x => x.area_number == areaNumber);
                            }
                            break;
                        case "serialtypenumber":
                            if (int.TryParse(param.Value, out var serialTypeNumber))
                            {
                                events = events.Where(x => x.serialTypeNumber == serialTypeNumber);
                            }
                            break;
                        case "eventdate":
                            if (DateTime.TryParse(param.Value, out var eventDate))
                            {
                                events = events.Where(x => x.event_date == eventDate);
                            }
                            break;
                        case "startdate":
                            if (DateTime.TryParse(param.Value, out var start))
                            {
                                startDate = start;
                            }
                            break;
                        case "enddate":
                            if (DateTime.TryParse(param.Value, out var end))
                            {
                                endDate = end;
                            }
                            break;
                        default:
                            break;
                    }
                }

                if (startDate != null)
                {
                    events = events.Where(x => x.event_date >= startDate);
                }

                if (endDate != null)
                {
                    events = events.Where(x => x.event_date <= endDate);
                }

                if (startDate != null && endDate != null && startDate > endDate)
                {
                    return BadRequest("Invalid search parameters: fromDate cannot be greater than toDate.");
                }

                var result = events.Select(x => new EventDto
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

                if (result.Count == 0)
                {
                    logger.Error($"event was not found");
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }


        // PUT: api/SearchEvent/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/SearchEvent/5
        public void Delete(int id)
        {
        }
    }
}
