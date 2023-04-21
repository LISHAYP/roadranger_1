using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using NLog;
using WebApplication1.DTO;
using WebGrease.Activities;

namespace WebApplication1.Controllers
{
    public class AskForHelpController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();

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

                logger.Info("new ask for help request was edded!");
                return Ok("New ask for help was created");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }
       [HttpPost]
        [Route("api/post/showAskforhelp")]
        public IHttpActionResult ShowAskForHelp([FromBody] AskForHelpDto requastNumber)
        {
            try
            {
                var askForHelp = db.tblAskForHelp.Where(a => a.requastNumber == requastNumber.RequastNumber).Select(
                    x => new ShowAskForHelpDto { 
                     Details = x.details,
                    Latitude = x.latitude,
                    Longitude = x.longitude,
                    Picture = x.picture
                    }).ToList();


                // If no matching record was found, return a not found response
                if (askForHelp == null)
                {
                    return NotFound();
                }
                
                return Ok(askForHelp);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
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
