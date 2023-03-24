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
        project_testEntities db = new project_testEntities();
        // GET: api/Traveler
        public IEnumerable<tblTravelere> Get()
        {
            List<tblTravelere> travelers = db.tblTraveleres.ToList();
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
