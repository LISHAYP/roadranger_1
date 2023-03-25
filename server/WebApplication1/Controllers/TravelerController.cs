using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Web.Http;
using data;

namespace WebApplication1.Controllers
{
    public class TravelerController : ApiController
    {
        igroup190_test1Entities db =  new igroup190_test1Entities();    
        // GET: api/Traveler
        public IEnumerable<travelere> Get()
        {
            List<travelere> travelereList = db.traveleres.ToList();
            return travelereList;
        }

        [HttpPost]
        [Route("api/post/SignUp")]
        public IHttpActionResult PostSignUp([FromBody] travelere value)
        {
            try
            {
                // create a new traveler user
                travelere newTraveler = new travelere
                {
                    first_name = value.first_name,
                    last_name = value.last_name,
                    travler_email = value.travler_email,
                    phone = value.phone,
                    dateOfBirth = value.dateOfBirth,
                    gender = value.gender,
                    insurence_company = value.insurence_company,
                    notifications = value.notifications,
                    location = value.location,
                    save_location = value.save_location,
                    password = value.password,
                    chat = value.chat
                };

                db.traveleres.Add(newTraveler);
                db.SaveChanges();
                return Ok("Traveler created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/post/login")]
        public IHttpActionResult Post([FromBody] travelere value)
        {
            var users = db.traveleres.Select(x => new
            {
                email = x.travler_email,
                password = x.password
            }).ToList();
            try
            {
                foreach (var item in users)
                {
                    if (item.email == value.travler_email && item.password == value.password)
                    {
                        return Ok("good!");
                    }
                }
            }
            catch
            {
                return BadRequest("bad");
            }
            return BadRequest("bad");
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
