using data;
using NLog;
using SendGrid.Helpers.Mail;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class StackholderController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


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

        public void Post([FromBody] string value)
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
                    Password = stakeholder.password,
                    token = stakeholder.token,
                    picture = stakeholder.picture
                    // Map related entities as well if needed
                };
                logger.Info("stackholder was founs succesfully");
                return Ok(stakeholderDTO);

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }

        //[HttpPost]
        //[Route("api/post/GetTravelersByInsuranceCompany")]
        //public IHttpActionResult GetTravelersByInsuranceCompany([FromBody] TravelerDto insuranceCompany)
        //{
        //    try
        //    {

        //        var travelers = db.traveleres.Where(x => x.insurence_company == insuranceCompany.insurence_company).ToList();

        //        if (travelers == null)
        //        {
        //            logger.Info($"travelers were not found in the insurence {insuranceCompany.insurence_company}");
        //            return NotFound();
        //        }

        //        List<TravelerDto> travelerDtos = new List<TravelerDto>();

        //        foreach (var traveler in travelers)
        //        {
        //            TravelerDto travelerDto = new TravelerDto()
        //            {
        //                traveler_id = traveler.traveler_id,
        //                first_name = traveler.first_name,
        //                last_name = traveler.last_name,
        //                travler_email = traveler.travler_email,
        //                phone = traveler.phone,
        //                notifications = traveler.notifications,
        //                insurence_company = traveler.insurence_company,
        //                location = traveler.location,
        //                save_location = traveler.save_location,
        //                dateOfBirth = traveler.dateOfBirth,
        //                gender = traveler.gender,
        //                password = traveler.password,
        //                chat = traveler.chat,
        //                Picture = traveler.picture
        //            };
        //            travelerDtos.Add(travelerDto);
        //        }

        //        return Ok(travelerDtos);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex.Message);
        //        return BadRequest();
        //    }
        //}

        [HttpPost]
        [Route("api/post/GetTravelersByInsuranceCompany")]
        public IHttpActionResult GetTravelersByInsuranceCompany([FromBody] TravelerDto insuranceCompany)
        {
            try
            {
                var travelers = db.traveleres
                    .Where(x => x.insurence_company == insuranceCompany.insurence_company)
                    .ToList();

                if (travelers == null)
                {
                    logger.Info($"travelers were not found in the insurence {insuranceCompany.insurence_company}");
                    return NotFound();
                }

                var travelerLocations = db.tblLocations
                    .GroupBy(x => x.travelerId)
                    .Select(g => new
                    {
                        TravelerId = g.Key,
                        LastLocation = g.OrderByDescending(x => x.dateAndTime)
                            .Select(x => new LocationDto
                            {
                                TravelerId = x.travelerId,
                                DateAndTime = x.dateAndTime,
                                Latitude = x.latitude,
                                Longitude = x.longitude
                            })
                            .FirstOrDefault()
                    })
                    .ToList();

                var result = travelers
                    .Select(t => new
                    {
                        traveler_id = t.traveler_id,
                        first_name = t.first_name,
                        last_name = t.last_name,
                        travler_email = t.travler_email,
                        phone = t.phone,
                        notifications = t.notifications,
                        insurence_company = t.insurence_company,
                        location = t.location,
                        save_location = t.save_location,
                        dateOfBirth = t.dateOfBirth,
                        gender = t.gender,
                        password = t.password,
                        chat = t.chat,
                        Picture = t.picture,
                        missing = t.missing,
                        last_location = travelerLocations
                            .Where(x => x.TravelerId == t.traveler_id)
                            .Select(x => x.LastLocation)
                            .FirstOrDefault()
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }

        //Get Travelers By Insurance Company no last location
        [HttpPost]
        [Route("api/post/GetTravelersByInsuranceCompanyNLL")]
        public IHttpActionResult GetTravelersByInsuranceCompanyNLL([FromBody] TravelerDto insuranceCompany)
        {
            try
            {
                var travelers = db.traveleres
                    .Where(x => x.insurence_company == insuranceCompany.insurence_company)
                    .ToList();

                if (travelers == null)
                {
                    logger.Info($"travelers were not found in the insurence {insuranceCompany.insurence_company}");
                    return NotFound();
                }

                var travelerLocations = db.tblLocations
                    .GroupBy(x => x.travelerId)
                    .Select(g => new
                    {
                        TravelerId = g.Key,
                        LastLocation = g.OrderByDescending(x => x.dateAndTime)
                            .Select(x => new LocationDto
                            {
                                TravelerId = x.travelerId,
                                DateAndTime = x.dateAndTime,
                                Latitude = x.latitude,
                                Longitude = x.longitude
                            })
                            .FirstOrDefault()
                    })
                    .ToList();

                var result = travelers
                    .Select(t => new
                    {
                        traveler_id = t.traveler_id,
                        first_name = t.first_name,
                        last_name = t.last_name,
                        travler_email = t.travler_email,
                        phone = t.phone,
                        notifications = t.notifications,
                        insurence_company = t.insurence_company,
                        location = t.location,
                        save_location = t.save_location,
                        dateOfBirth = t.dateOfBirth,
                        gender = t.gender,
                        password = t.password,
                        chat = t.chat,
                        Picture = t.picture,
                        missing = t.missing,
                        last_location = travelerLocations
                            .Where(x => x.TravelerId == t.traveler_id)
                            .Select(x => x.LastLocation)
                            .FirstOrDefault()
                    }).Where(t => t.last_location != null) // Exclude travelers with null last location
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }
        [HttpPut]
        [Route("api/put/stakeholder/update")]
        public IHttpActionResult PutUpdateStakeholder([FromBody] StackholderDto value)
        {
            try
            {
                var stakeholder = db.stakeholders.Where(x => x.stakeholder_email == value.StakeholderEmail).FirstOrDefault();

                if (stakeholder == null)
                {
                    logger.Info("there is not such a stackholder");
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
                stakeholder.picture = value.picture;

                db.Entry(stakeholder).State = EntityState.Modified;
                db.SaveChanges();
                logger.Info($"the stackholder {value.FullName} was updated succesfully");
                return Ok("Stakeholder updated successfully.");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }
        // checks the insurence company of the tarveler and returns all the stakeholders from the same company
        [HttpPost]
        [Route("api/stakeholders")]
        public IHttpActionResult GetStakeholdersByInsuranceCompany([FromBody] TravelerDto traveler)
        {
            var stakeholders = db.stakeholders
                .Where(s => s.stakeholder_name == traveler.insurence_company)
                .Select(s => new StackholderDto
                {
                    StakeholderId = s.stakeholder_id,
                    FullName = s.full_name,
                    StakeholderEmail = s.stakeholder_email,
                    Phone = s.phone,
                    Notifications = s.notifications,
                    Chat = s.chat,
                    StakeholderName = s.stakeholder_name,
                    Approved = s.approved,
                    ApprovelDate = s.approvel_date,
                    StakeholderType = s.stakeholder_type,
                    Password = s.password,
                    token = s.token,
                    picture = s.picture,
                    
                })
                .ToList();

            return Ok(stakeholders);
        }

        [HttpPut]
        [Route("api/stackholder/updatetoken")]
        public IHttpActionResult UpdateToken(string email, [FromBody] StackholderDto value)
        {
            try
            {
                var stackholder = db.stakeholders.SingleOrDefault(x => x.stakeholder_email == value.StakeholderEmail);
                if (stackholder == null)
                {
                    logger.Error($"stackholder with email : {value.StakeholderEmail} was not found");
                    return NotFound();
                }

                // Update the token field
                stackholder.token = value.token;

                // Save the changes to the database
                db.Entry(stackholder).State = EntityState.Modified;
                db.SaveChanges();

                logger.Info($"token was updated in the database for stackholder with email : {value.StakeholderEmail}");
                return Ok($"token was updated in the database for stackholder with email : {value.StakeholderEmail}");
            }
            catch(Exception ex)
            {
                logger.Error(ex.Message);
                return InternalServerError();
            }
        }


        [HttpPost]
        [Route("api/post/shforgotpassword")]
        public async Task<IHttpActionResult> ForgotPasswordAsync([FromBody] StackholderDto value)
        {

            try
            {

                // Find the user with the specified email address
                var user = db.stakeholders.SingleOrDefault(x => x.stakeholder_email == value.StakeholderEmail);
                if (user == null)
                {
                    logger.Error($"stakeholder with email : {value.StakeholderEmail} was not found");
                    return NotFound();
                }


                // Generate a new password and update the user's record in the database
                var newPassword = GeneratePassword();
                user.password = newPassword;
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                logger.Info($"new password was saved in the database to stakeholder id number: {value.StakeholderId}");

                var mailapi = db.tblApi.Select(x => x.api).SingleOrDefault();
                var sendGridClient = new SendGridClient(mailapi);
                var from = new EmailAddress("roadranger1@walla.com", "Road Ranger Admin");
                var subject = "New Password";
                var to = new EmailAddress(user.stakeholder_email, user.full_name);
                var plainContent = "Dear " + user.full_name;
                var htmlContent = $"Dear {user.full_name}, \n Your new password is: {newPassword}";
                var mailMessage = MailHelper.CreateSingleEmail(from, to, subject, plainContent, htmlContent);
                await sendGridClient.SendEmailAsync(mailMessage);


                return Ok("new password email was sent succesfully (:");
            }
            catch (Exception ex)
            {

                logger.Error(ex.Message);
                return BadRequest();
            }
        }

        private string GeneratePassword()
        {
            const string allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var rand = new Random();
            var chars = new char[8];
            for (var i = 0; i < chars.Length; i++)
            {
                chars[i] = allowedChars[rand.Next(allowedChars.Length)];
            }
            return new string(chars);
        }

        // PUT: api/Stackholder/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Stackholder/5
        public void Delete(int id)
        {
        }
    }
}
