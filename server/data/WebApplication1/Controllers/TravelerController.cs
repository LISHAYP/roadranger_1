using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATAa;

namespace WebApplication1.Controllers
{
   
    public class TravelerController : ApiController
    {
       igroup190_project db = new igroup190_project();
        // GET: api/Traveler
        public IEnumerable<traveleres> Get()
        {
            List<traveleres> travelers = db.traveleres.ToList();
            return travelers;
        }

        // GET: api/Traveler/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Traveler
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Traveler/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Traveler/5
        public void Delete(int id)
        {
        }
    }
}
