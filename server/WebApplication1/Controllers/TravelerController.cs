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



namespace WebApplication1.Controllers
{
    public class TravelerController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
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
                    Picture = traveler.picture
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
                    picture = value.picture
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
                chat = x.chat,
                Picture = x.picture

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
                    return BadRequest("wrong email or password");
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
                traveler.picture = value.Picture;

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
        public async Task<IHttpActionResult> ForgotPasswordAsync([FromBody] TravelerDto value)
        {
            try
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
                //var message = new MailMessage();
                //message.To.Add(new MailAddress(user.travler_email));
                //message.Subject = "New Password";
                //message.Body = "Your new password is: " + newPassword;

                //var sendGridClient = new SendGridClient("");
                //var from = new EmailAddress("roadranger1@walla.com", "Road Ranger Admin");
                //var subject = "New Password";
                //var to = new EmailAddress(user.travler_email, user.first_name);
                //var plainContent = "Dear " + user.first_name;
                //var htmlContent = $"Your new password is: {newPassword}";
                //var mailMessage = MailHelper.CreateSingleEmail(from, to, subject, plainContent, htmlContent);
                //await sendGridClient.SendEmailAsync(mailMessage);



                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Road Ranger Admin", "roadranger1@walla.com"));
                message.To.Add(new MailboxAddress(user.first_name, user.travler_email));
                message.Subject = "New Password";

                message.Body = new TextPart("Dear " + user.first_name)
                {
                    Text = $"Your new password is: {newPassword}"
                };

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, false);
                    await client.AuthenticateAsync("roadranger178@gmail.com", "road_ranger1!");
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                return Ok("new password email was sent succesfully (:");
            }
            catch (Exception)
            {


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
            catch (Exception)
            {

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
