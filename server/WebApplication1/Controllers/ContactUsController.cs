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
    public class ContactUsController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();

        // GET: api/ContactUs
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ContactUs/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("api/newcontactus")]
        public IHttpActionResult PostContactUs([FromBody] ContactUsDto contactUsDto)
        {
            try
            {
                tblContactUs contactUs = new tblContactUs
                {
                    first_name = contactUsDto.FirstName,
                    last_name = contactUsDto.LastName,
                    email = contactUsDto.Email,
                    phone_number = contactUsDto.PhoneNumber,
                    date = contactUsDto.Date,
                    time = contactUsDto.Time,
                    request_type = contactUsDto.RequestType,
                    details = contactUsDto.Details
                };

                db.tblContactUs.Add(contactUs);
                db.SaveChanges();

                logger.Info("New contact us entry was added!");
                return Ok("New contact us entry was created");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        // POST: api/ContactUs
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/ContactUs/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ContactUs/5
        public void Delete(int id)
        {
        }
    }
}
