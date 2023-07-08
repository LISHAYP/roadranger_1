using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Policy;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Services.Description;
using data;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SendGrid;
using SendGrid.Helpers.Mail;
using WebApplication1.DTO;
using System.Security.Cryptography.X509Certificates;
using NLog;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace WebApplication1.Controllers
{
    public class TravelerController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();

        // GET: api/Traveler
        public IEnumerable<TravelerDto> Get()
        {
            List<traveleres> travelers = db.traveleres.ToList();

            List<TravelerDto> travelerDtos = new List<TravelerDto>();

            foreach (var traveler in travelers)
            {
                TravelerDto travelerDto = new TravelerDto
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
                    Picture = traveler.picture,
                    token=traveler.token,
                    missing=traveler.missing,
                };

                travelerDtos.Add(travelerDto);
            }

            return travelerDtos;
        }



        [HttpPost]
        [Route("api/post/SignUp")]
        public IHttpActionResult PostSignUp([FromBody] traveleres value)
        {
            try
            {
                var existingUser = db.traveleres.FirstOrDefault(x => x.travler_email == value.travler_email);
                if (existingUser != null)
                {
                    return BadRequest("This email is already in use, please registar with another email.");
                }

                // create a new traveler user
                traveleres newTraveler = new traveleres
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
                    chat = value.chat,
                    picture = value.picture,
                    missing=value.missing,
                };

                db.traveleres.Add(newTraveler);
                db.SaveChanges();
                logger.Info("new traveler was added to the database!");
                return Ok("Traveler created successfully.");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("api/post/login")]
        public IHttpActionResult Post([FromBody] TravelerDto value)
        {
            var email = value.travler_email.ToLower(); // Convert email to lowercase

            var existingUser = db.traveleres.FirstOrDefault(x => x.travler_email.ToLower() == email);
            if (existingUser == null)
            {
                logger.Info("login failed! Email does not exist in the system");
                return BadRequest("login failed! Email does not exist in the system, please register first!");
            }

            var users = db.traveleres
                .Where(x => x.travler_email.ToLower() == email && x.password == value.password)
                .Select(x => new TravelerDto
                {
                    traveler_id = x.traveler_id,
                    travler_email = x.travler_email,
                    password = x.password,
                    first_name = x.first_name,
                    last_name = x.last_name,
                    phone = x.phone,
                    dateOfBirth = x.dateOfBirth,
                    gender = x.gender,
                    insurence_company = x.insurence_company,
                    notifications = x.notifications,
                    location = x.location,
                    save_location = x.save_location,
                    chat = x.chat,
                    Picture = x.picture,
                    token = x.token
                })
                .ToList();

            try
            {
                if (users.Count == 1)
                {
                    return Ok(users[0]);
                }
                else
                {
                    logger.Error("Wrong email/password in the login");
                    return BadRequest("Wrong email or password");
                }
            }
            catch
            {
                logger.Error("Login failed");
                return BadRequest("Bad");
            }
        }

        // GET: api/Traveler/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Traveler
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Traveler/5
        [HttpPut]
        [Route("api/put/update/")]
        //https://localhost:44319/api/put/update?email=Liel@gmail.com
        public IHttpActionResult PutUpdate(string email, [FromBody] TravelerDto value)
        {
            try
            {

                var traveler = db.traveleres.Where(x => x.travler_email == email).FirstOrDefault();

                if (traveler == null)
                {
                    logger.Error($"traveler with email : {traveler.travler_email} was not found");
                    return NotFound();
                }

                // update the traveler user
                traveler.first_name = value.first_name;
                traveler.last_name = value.last_name;
                traveler.travler_email = value.travler_email;
                traveler.phone = value.phone;
                traveler.dateOfBirth = value.dateOfBirth;
                traveler.gender = value.gender;
                traveler.insurence_company = value.insurence_company;
                traveler.notifications = value.notifications;
                traveler.location = value.location;
                traveler.save_location = value.save_location;
                traveler.password = value.password;
                traveler.chat = value.chat;
                traveler.picture = value.Picture;
                

                db.Entry(traveler).State = EntityState.Modified;
                db.SaveChanges();
                logger.Info($"traveler with email: {traveler.travler_email} was updated succesfully!");

                return Ok("Traveler updated successfully.");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/post/missingtrue")]
        public IHttpActionResult UpdateMissingTrue([FromBody] TravelerDto travelerDto)
        {
            try
            {
                var traveler = db.traveleres.FirstOrDefault(x => x.traveler_id == travelerDto.traveler_id);

                if (traveler == null)
                {
                    logger.Error($"Traveler with ID: {travelerDto.traveler_id} was not found");
                    return NotFound();
                }

                // Update the missing field to true
                traveler.missing = true;

                db.SaveChanges();

                logger.Info($"Traveler with ID: {travelerDto.traveler_id} was updated successfully!");

                // Return the updated traveler details
                var updatedTravelerDto = new TravelerDto
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
                    Picture = traveler.picture,
                    token = traveler.token,
                    missing = traveler.missing
                };

                return Ok(updatedTravelerDto);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/post/missingfalse")]
        public IHttpActionResult UpdateMissingFalse([FromBody] TravelerDto travelerDto)
        {
            try
            {
                var traveler = db.traveleres.FirstOrDefault(x => x.traveler_id == travelerDto.traveler_id);

                if (traveler == null)
                {
                    logger.Error($"Traveler with ID: {travelerDto.traveler_id} was not found");
                    return NotFound();
                }

                // Retrieve the events from the database that match the conditions
                var events = db.tblEvents.Where(e => e.event_status == true && e.serialTypeNumber == 1003 && e.travelerId == travelerDto.traveler_id);

                // If no matching events are found, return a bad request
                if (!events.Any())
                {
                    return BadRequest("No matching events found.");
                }

                foreach (var existingEvent in events)
                {
                    // Update the event status to false
                    existingEvent.event_status = false;
                }

                // Update the missing field to false
                traveler.missing = false;

                db.SaveChanges();

                logger.Info($"Traveler with ID: {travelerDto.traveler_id} was updated successfully!");

                // Return the updated traveler details
                var updatedTravelerDto = new TravelerDto
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
                    Picture = traveler.picture,
                    token = traveler.token,
                    missing = traveler.missing
                };

                return Ok(updatedTravelerDto);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("api/traveler/updatetoken")]
        public IHttpActionResult UpdateToken(string email,[FromBody] TravelerDto value)
        {
            try
            {
                var traveler = db.traveleres.SingleOrDefault(x => x.travler_email == value.travler_email);
                if (traveler == null)
                {
                    logger.Error($"traveler with email : {value.travler_email} was not found");
                    return NotFound();
                }

                // Update the token field
                traveler.token = value.token;

                // Save the changes to the database
                db.Entry(traveler).State = EntityState.Modified;
                db.SaveChanges();

                logger.Info($"token was updated in the database for traveler with email : {value.travler_email}");
                return Ok($"token was updated in the database for traveler with email : {value.travler_email}");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return InternalServerError();
            }
        }

        // DELETE: api/Traveler/5
        public void Delete(int id)
        {
        }


        [HttpPost]
        [Route("api/post/forgotpassword")]
        public async Task<IHttpActionResult> ForgotPasswordAsync([FromBody] TravelerDto value)
        {

            try
            {

                // Find the user with the specified email address
                var user = db.traveleres.SingleOrDefault(x => x.travler_email == value.travler_email);
                if (user == null)
                {
                    logger.Error($"traveler with email : {value.travler_email} was not found");
                    return NotFound();
                }
                
                
                // Generate a new password and update the user's record in the database
                var newPassword = GeneratePassword();
                user.password = newPassword;
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                logger.Info($"new password was saved in the database to traveler id number: {value.traveler_id}");

                var mailapi = db.tblApi.FirstOrDefault(x => x.name == "mail")?.api;
                var sendGridClient = new SendGridClient(mailapi);
                var from = new EmailAddress("roadranger1@walla.com", "Road Ranger Admin");
                var subject = "New Password";
                var to = new EmailAddress(user.travler_email, user.first_name);
                var plainContent = "Dear " + user.first_name;
                var htmlContent = $"Dear {value.first_name}, \n Your new password is: {newPassword}";
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

        [HttpPost]
        [Route("api/traveler/details")]
        public IHttpActionResult GetTravelerDetails([FromBody] TravelerDto travelerId)
        {
            try
            {

                // Find the traveler in the database based on the ID
                var traveler = db.traveleres.FirstOrDefault(x => x.traveler_id == travelerId.traveler_id);

                if (traveler == null)
                {
                    // If the traveler is not found, return a 404 Not Found response
                    logger.Error($"traveler with email : {traveler.travler_email} was not found");
                    return NotFound();

                }

                // Map the traveler entity to a DTO and return it
                var travelerDto = new TravelerDto
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

                return Ok(travelerDto);
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
    }
}
