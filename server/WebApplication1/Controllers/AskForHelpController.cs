using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class AskForHelpController : ApiController
    {
        igroup190_test1Entities2 db = new igroup190_test1Entities2();
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
        public IHttpActionResult PostAskForHelp([FromBody] tblAskForHelp value)
        {
            try
            {
                tblAskForHelp askForHelp = new tblAskForHelp
                {
                    details = value.details,
                    latitude = value.latitude,
                    longitude = value.longitude,
                    picture = value.picture,
                    traveler_id = value.traveler_id,
                    serialTypeNumber = value.serialTypeNumber,
                    country_number = value.country_number,
                    area_number = value.area_number,
                    stakeholder_id = value.stakeholder_id

                };

                db.tblAskForHelp.Add(askForHelp);
                db.SaveChanges();

                return Ok("New ask for help was created");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("api/askforhelp/{requastNumber}")]
        public IHttpActionResult ShowAskForHelp(int requastNumber)
        {
            try
            {
                var askForHelp = db.tblAskForHelp.FirstOrDefault(a => a.requastNumber == requastNumber);


                // If no matching record was found, return a not found response
                if (askForHelp == null)
                {
                    return NotFound();
                }
                var ShowAskForHelpDto = new ShowAskForHelpDto
                {
                    Details = askForHelp.details,
                    Latitude = askForHelp.latitude,
                    Longitude = askForHelp.longitude,
                    Picture = askForHelp.picture
                };

                return Ok(ShowAskForHelpDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/AskForHelp/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/AskForHelp/5
        public void Delete(int id)
        {
        }
    }
}