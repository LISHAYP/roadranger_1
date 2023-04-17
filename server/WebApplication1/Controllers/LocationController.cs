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
    public class LocationController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

        // GET: api/Location
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
        // GET: api/locations
        [HttpGet]
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
                return BadRequest("Request body is null");
            }

            try
            {
                var traveler = db.traveleres.FirstOrDefault(x => x.traveler_id == dto.TravelerId);

                if (traveler == null)
                {
                    return NotFound($"Traveler with ID {dto.TravelerId} not found");
                }

                var location = new tblLocations
                {
                    travelerId = dto.TravelerId,
                    locationNumber = dto.LocationNumber,
                    longitude = dto.Longitude,
                    latitude = dto.Latitude,
                    dateAndTime = dto.DateAndTime
                };

                db.tblLocations.Add(location);
                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                // Log the error message
                Console.WriteLine(ex.Message);
                return InternalServerError();
            }
        }

        private IHttpActionResult NotFound(string v)
        {
            throw new NotImplementedException();
        }


        // POST: api/Location
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Location/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Location/5
        public void Delete(int id)
        {
        }
    }
}
