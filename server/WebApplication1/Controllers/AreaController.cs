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
    public class AreaController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        // GET: api/Area
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Area/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Area
        [HttpPost]
        [Route("api/post/area")]
        public IHttpActionResult AddArea([FromBody] CountryAreaDto area)
        {
            try
            {
                // Check if the country already has this area
                var existingArea = db.tblArea.FirstOrDefault(a => a.country_number == area.country_number && a.area_name == area.area_name);

                if (existingArea != null)
                {
                    // The area already exists, so return its area_number
                    return Ok(existingArea.area_number);
                }
                else
                {
                    int newAreaNumber = 1;
                    var maxArea = db.tblArea.Where(a => a.country_number == area.country_number).OrderByDescending(a => a.area_number).FirstOrDefault();
                    if (maxArea != null)
                    {
                        newAreaNumber = maxArea.area_number + 1;
                    }
                    var newArea = new tblArea
                    {
                        country_number = area.country_number,
                        area_number = newAreaNumber,
                        area_name = area.area_name
                    };
                    // The area doesn't exist, so add a new row to the table
                    db.tblArea.Add(newArea);
                    db.SaveChanges();

                    // Return the new area_number
                    return Ok(area.area_number);
                }
            }
            catch (Exception ex)
            {

                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Area/5
        public void Put(int id, [FromBody] string value)
        {

        }

        // DELETE: api/Area/5
        public void Delete(int id)
        {

        }
    }
}
