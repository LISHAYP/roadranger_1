using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;
using NLog;
using System.Web.Http.Routing.Constraints;

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
                    travler_email =location.traveleres.travler_email,
                    phone = location.traveleres.phone,
                    notifications = location.traveleres.notifications,
                    insurence_company = location.traveleres.insurence_company,
                    location = location.traveleres.location,
                    save_location = location.traveleres.save_location,
                    dateOfBirth = location.traveleres.dateOfBirth,
                    gender = location.traveleres.gender,
                    password = location.traveleres.password,
                    chat = location.traveleres.chat,
                    Picture = location.traveleres.picture,
                    missing = location.traveleres.missing,
                    last_location = new LocationDto
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

        [HttpPost]
        [Route("api/post/checkdistance")]
        public IHttpActionResult CheckDistance(EventDto eventNumber, double longtiude, double latitude)
        {
            try
            {
                // Retrieve the event coordinates based on the event number
                var eventCoordinates = db.tblEvents
                    .Where(e => e.eventNumber == eventNumber.eventNumber)
                    .Select(e => new { e.longitude, e.latitude })
                    .FirstOrDefault();

                if (eventCoordinates == null)
                {
                    return NotFound("the event was not found"); // Event not found
                }

                // Calculate the distance between the event and traveler coordinates
                double distance = CalculateDistance((double)eventCoordinates.latitude, (double)eventCoordinates.longitude,longtiude,latitude);

                // Check if the distance is within 1 km
                bool isWithinRange = distance <= 1.0;

                return Ok(isWithinRange);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Implementation of the Haversine formula
            const double R = 6371; // Earth radius in kilometers
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = R * c;
            return distance;
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
