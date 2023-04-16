using data;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
            try
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
            catch (Exception)
            {

                return BadRequest();
            }
        }

        [HttpPost]
        [Route("api/post/GetTravelersByInsuranceCompany")]
        public IHttpActionResult GetTravelersByInsuranceCompany([FromBody] TravelerDto insuranceCompany)
        {
            try
            {

                var travelers = db.traveleres.Where(x => x.insurence_company == insuranceCompany.insurence_company).ToList();

                if (travelers == null)
                {
                    return NotFound();
                }

                List<TravelerDto> travelerDtos = new List<TravelerDto>();

                foreach (var traveler in travelers)
                {
                    TravelerDto travelerDto = new TravelerDto()
                    {
                        traveler_id = traveler.traveler_id,
                        first_name = traveler.first_name,
                        last_name = traveler.last_name,
                        travler_email = traveler.travler_email,
                        phone = traveler.phone,
                        notifications = traveler.notifications,
                        insurence_company = traveler.insurence_company,
                        location = traveler.location,
                        save_location = traveler.save_location,
                        dateOfBirth = traveler.dateOfBirth,
                        gender = traveler.gender,
                        password = traveler.password,
                        chat = traveler.chat,
                        Picture = traveler.picture
                    };
                    travelerDtos.Add(travelerDto);
                }

                return Ok(travelerDtos);
            }
            catch (Exception)
            {

                return BadRequest();
            }
        }

        [HttpPut]
        [Route("api/put/stakeholder/update")]
        public IHttpActionResult PutUpdateStakeholder( [FromBody] StackholderDto value)
        {
            try
            {
                var stakeholder = db.stakeholders.Where(x => x.stakeholder_email == value.StakeholderEmail).FirstOrDefault();

                if (stakeholder == null)
                {
                    return NotFound();
                }

                // update the stakeholder user
                stakeholder.full_name = value.FullName;
                stakeholder.stakeholder_email = value.StakeholderEmail;
                stakeholder.phone = value.Phone;
                stakeholder.notifications = value.Notifications;
                stakeholder.chat = value.Chat;
                stakeholder.stakeholder_name = value.StakeholderName;
                stakeholder.stakeholder_type = value.StakeholderType;
                stakeholder.password = value.Password;

                db.Entry(stakeholder).State = EntityState.Modified;
                db.SaveChanges();

                return Ok("Stakeholder updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
