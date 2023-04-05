using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Web.Http;
using data;
using MailKit.Security;
using MimeKit;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class TravelerController : ApiController
    {
        igroup190_test1Entities2 db = new igroup190_test1Entities2();
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
                    chat = traveler.chat
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
                    chat = value.chat
                };

                db.traveleres.Add(newTraveler);
                db.SaveChanges();
                return Ok("Traveler created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/post/login")]
        public IHttpActionResult Post([FromBody] TravelerDto value)
        {
            var users = db.traveleres.Where(x => x.travler_email == value.travler_email && x.password == value.password).Select(x => new TravelerDto
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
                chat = x.chat
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
                    return BadRequest("bad");
                }
            }
            catch
            {
                return BadRequest("bad");
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

                db.Entry(traveler).State = EntityState.Modified;
                db.SaveChanges();

                return Ok("Traveler updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // DELETE: api/Traveler/5
        public void Delete(int id)
        {
        }

        [HttpPost]
        [Route("api/post/forgotpassword")]
        public IHttpActionResult ForgotPassword([FromBody] TravelerDto value)
        {
            // Find the user with the specified email address
            var user = db.traveleres.SingleOrDefault(x => x.travler_email == value.travler_email);
            if (user == null)
            {
                return NotFound();
            }

            // Generate a new password and update the user's record in the database
            var newPassword = GeneratePassword();
            user.password = newPassword;
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();

            // Send an email to the user with the new password
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Road Ranger Admin", "roadranger1@walla.com"));
            message.To.Add(new MailboxAddress("Dear: " + user.first_name, user.travler_email));
            message.Subject = "Password Reset";
            message.Body = new TextPart("plain")
            {
                Text = $"Your new password is: {newPassword}"
            };

            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                client.Connect("smtp.walla.com", 587, SecureSocketOptions.StartTls);
                client.Authenticate("roadranger1@walla.com", "Ro1357.");
                client.Send(message);
                client.Disconnect(true);
            }

            return Ok();
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
