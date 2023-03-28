﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Web.Http;
using data;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class TravelerController : ApiController
    {
        igroup190_test1Entities1 db = new igroup190_test1Entities1();
        // GET: api/Traveler
        public IEnumerable<TravelerDto> Get()
        {
            List<travelere> travelers = db.traveleres.ToList();

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
        public IHttpActionResult PostSignUp([FromBody] travelere value)
        {
            try
            {
                // create a new traveler user
                travelere newTraveler = new travelere
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
        public IHttpActionResult Post([FromBody] travelere value)
        {
            var users = db.traveleres.Select(x => new
            {
                email = x.travler_email,
                password = x.password
            }).ToList();
            try
            {
                foreach (var item in users)
                {
                    if (item.email == value.travler_email && item.password == value.password)
                    {
                        return Ok("good!");
                    }
                }
            }
            catch
            {
                return BadRequest("bad");
            }
            return BadRequest("bad");
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
        public IHttpActionResult PutUpdate(string email, [FromBody] travelere value)
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
    }
}
