using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;

namespace WebApplication1.Controllers
{
    public class AskForHelpController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        // GET: api/AskForHelp
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/AskForHelp/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/AskForHelp
        [HttpPost]
        [Route("api/askforhelp")]
        public IHttpActionResult PostAskForHelp([FromBody]tblAskForHelp value)
        {
            try
            {
                tblAskForHelp AskForHelp = new tblAskForHelp
                {
                    requastNumber = value.requastNumber,
                    details = value.details,
                    latitude = value.latitude,//00.0000
                    longitude = value.longitude,//-00.0000
                    picture = value.picture,
                    userId = value.userId,
                    serialTypeNumber = value.serialTypeNumber,
                    country_number = value.country_number,
                    area_number = value.area_number
                };
                db.tblAskForHelps.Add(AskForHelp);
                db.SaveChanges();
                return Ok("New ask for help was created");
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
           
        }

        // PUT: api/AskForHelp/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/AskForHelp/5
        public void Delete(int id)
        {
        }
    }
}
