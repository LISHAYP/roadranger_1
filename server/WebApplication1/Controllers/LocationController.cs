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
