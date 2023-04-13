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
    public class StackholderController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

        // GET: api/Stackholder
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Stackholder/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Stackholder
        
        public void Post([FromBody]string value)
        {

        }

        [HttpPost]
        [Route("api/post/stackholder")]
        public IHttpActionResult GetStakeholderDetails([FromBody] StackholderDto loginDTO)
        {
            // Check if the email and password are valid
            var stakeholder = db.stakeholders.SingleOrDefault(x => x.stakeholder_email == loginDTO.StakeholderEmail && x.password == loginDTO.Password);
            if (stakeholder == null)
            {
                return BadRequest("Invalid email or password");
            }

            // Map the stakeholder to a DTO
            var stakeholderDTO = new StackholderDto
            {
                StakeholderId = stakeholder.stakeholder_id,
                FullName = stakeholder.full_name,
                StakeholderEmail = stakeholder.stakeholder_email,
                Phone = stakeholder.phone,
                Notifications = stakeholder.notifications,
                Chat = stakeholder.chat,
                StakeholderName = stakeholder.stakeholder_name,
                Approved = stakeholder.approved,
                ApprovelDate = stakeholder.approvel_date,
                StakeholderType = stakeholder.stakeholder_type,
                Password = stakeholder.password
                // Map related entities as well if needed
            };

            return Ok(stakeholderDTO);
        }

        // PUT: api/Stackholder/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Stackholder/5
        public void Delete(int id)
        {
        }
    }
}
