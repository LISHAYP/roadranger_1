using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using NLog;

namespace WebApplication1.Controllers
{
    public class LocationController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


        // GET: api/Location
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        // GET: api/locations
        [HttpPost]
        [Route("api/locations")]
        public IHttpActionResult GetTravelerLocations([FromBody] LocationDto travelerId)
        {
            List<tblLocations> locations = db.tblLocations.Where(x => x.travelerId == travelerId.TravelerId).ToList();

            List<LocationDto> locationDtos = new List<LocationDto>();

            foreach (var location in locations)
            {
                LocationDto locationDto = new LocationDto
                {
                    TravelerId = location.travelerId,
                    DateAndTime = location.dateAndTime,
                    Latitude = location.latitude,
                    Longitude = location.longitude
                };

                locationDtos.Add(locationDto);
            }

            return Ok(locationDtos);
        }

        //bring back all the travelers and their last location

        [HttpPost]
        [Route("api/lastlocation")]
        public IHttpActionResult GetLastTravelerLocations()
        {
            try
            {
                var lastLocations = db.tblLocations
                              .GroupBy(l => l.travelerId)
                              .Select(g => g.OrderByDescending(l => l.dateAndTime).FirstOrDefault());

                var travelerDtos = lastLocations.Select(location => new
                {
                    traveler_id = location.travelerId,
                    first_name = location.traveleres.first_name,
                    last_name = location.traveleres.last_name,
                    Picture = location.traveleres.picture,
                    LastLocation = new LocationDto
                    {
                        TravelerId = location.travelerId,
                        DateAndTime = location.dateAndTime,
                        Latitude = location.latitude,
                        Longitude = location.longitude
                    }
                }).ToList();

                return Ok(travelerDtos);
            }
            catch (Exception ex)
            {
                logger.Info(ex);
                return BadRequest(ex.Message);
            }
          
        }



        // GET: api/Location/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("api/traveler/location")]
        public IHttpActionResult SaveTravelerLocation([FromBody] LocationDto dto)
        {
            if (dto == null)
            {
                logger.Error("the location of the traveler is null");
                return BadRequest("Request body is null");
            }


            try
            {

                var traveler = db.traveleres.FirstOrDefault(x => x.traveler_id == dto.TravelerId);

                if (traveler == null)
                {
                    logger.Error("the traveler is not found!");
                    return NotFound($"Traveler with ID {dto.TravelerId} not found");
                }

                var location = new tblLocations
                {
                    travelerId = dto.TravelerId,
                    longitude = dto.Longitude,
                    latitude = dto.Latitude,
                    dateAndTime = dto.DateAndTime
                };

                db.tblLocations.Add(location);
                db.SaveChanges();
                logger.Info("the location of the traveler was added to the database!");
                return Ok();
            }
            catch (Exception ex)
            {
                // Log the error message
                logger.Error(ex.Message);
                return InternalServerError();
            }
        }

        [HttpGet]
        [Route("api/getlocations")]
        public IHttpActionResult GetLocationData()
        {
            try
            {
                var result = db.tblLocations
                    .Select(l => new
                    {
                        Latitude = l.latitude,
                        Longitude = l.longitude
                    })
                    .ToList();

                logger.Info("all the locations from tbl locations");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }
        private IHttpActionResult NotFound(string v)
        {
            throw new NotImplementedException();
        }


        // POST: api/Location
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Location/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Location/5
        public void Delete(int id)
        {
        }
    }
}
