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
    public class TypeController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

        // GET: api/Type
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Type/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Type
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Type/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost]
        [Route("api/post/type")]
        public IHttpActionResult PostType([FromBody] TypeDto type)
        {
            try
            {
                var existingType = db.tblType.FirstOrDefault(x => x.serialTypeNumber == type.serialTypeNumber);

                if (existingType != null)
                {
                    return Ok(existingType.typeName);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {

                return BadRequest();
            }
           
        }


        // DELETE: api/Type/5
        public void Delete(int id)
        {
        }
    }
}
