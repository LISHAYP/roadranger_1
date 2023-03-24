
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATAa;

namespace WebApplication1.Controllers
{
    public class travelerController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        // GET: api/traveler
        public IEnumerable<travelere> Get()
        {
            List<travelere> travelers = db.traveleres.ToList();
            return travelers;
        }

        // GET: api/traveler/5
        public string Get(int id)
        {
            return "value";
        }
        [HttpPost]
        [Route("api/post/SignUp")]
        public IHttpActionResult PostSignUp([FromBody] travelere value)
        {
            try
            {
                // create a new traveler user

                db.traveleres.Add((travelere)new travelere
                {
                    first_name = value.first_name,
                    last_name = value.last_name,
                    //password = value.password,
                    travler_email = value.travler_email,
                    phone = value.phone,
                    dateOfBirth = value.dateOfBirth,
                    gender = value.gender,
                    insurence_company = value.insurence_company,
                    notifications = value.notifications,
                    location = value.location,
                    save_location = value.save_location

                });
                db.SaveChanges();
                return Ok("Traveler created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/traveler
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/traveler/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/traveler/5
        public void Delete(int id)
        {
        }
    }
}
