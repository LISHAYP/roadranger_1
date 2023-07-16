using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using Newtonsoft.Json.Linq;
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

        //// POST: api/AskForHelp
        //[HttpPost]
        //[Route("api/askforhelp")]
        //public IHttpActionResult PostAskForHelp([FromBody] tblAskForHelp value)
        //{
        //    try
        //    {
        //        tblAskForHelp askForHelp = new tblAskForHelp
        //        {
        //            details = value.details,
        //            latitude = value.latitude,
        //            longitude = value.longitude,
        //            picture = value.picture,
        //            traveler_id = value.traveler_id,
        //            serialTypeNumber = value.serialTypeNumber,
        //            country_number = value.country_number,
        //            area_number = value.area_number,
        //            stakeholder_id = value.stakeholder_id

        //        };

        //        db.tblAskForHelp.Add(askForHelp);
        //        db.SaveChanges();

        //        logger.Info("new ask for help request was added!");
        //        return Ok("New ask for help was created");
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex.Message);
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPost]
        [Route("api/AskForHelpAndNotify")]
        public IHttpActionResult AskForHelpAndNotify([FromBody] tblAskForHelp value)
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
                    stakeholder_id = value.stakeholder_id,
                    event_date= value.event_date,
                    event_time= value.event_time,
                };

                db.tblAskForHelp.Add(askForHelp);
                db.SaveChanges();

                var timerServices = new TimerServices();
                var travelerIdsWithin1km = timerServices.GetTravelerIdsWithin1km(value.latitude, value.longitude);
                timerServices.SendPushToTravelersWithin1Km(travelerIdsWithin1km);

                logger.Info("New ask for help request was added, and push notification sent to travelers within 1 km.");
                return Ok("New ask for help was created, and push notification sent to travelers within 1 km.");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("api/post/GetAskForHelpWithin1Km")]
        public IHttpActionResult ShowAskForHelp([FromBody] LocationDto locationData)
        {
            try
            {
                decimal latitude = locationData.Latitude;
                decimal longitude = locationData.Longitude;

                var askForHelpEventsWithin1Km = new List<AskForHelpDto>();

                // Retrieve all Ask for Help events from the database
                var askForHelpEvents = db.tblAskForHelp.ToList();

                foreach (var askForHelpEvent in askForHelpEvents)
                {
                    // Calculate the distance between the given location and the event's location
                    double distance = CalculateDistance((double)latitude, (double)longitude, (double)askForHelpEvent.latitude, (double)askForHelpEvent.longitude);

                    // If the event is within 1 km, add it to the result list
                    if (distance <= 1)
                    {
                        var traveler = db.traveleres.FirstOrDefault(t => t.traveler_id == askForHelpEvent.traveler_id);

                        var askForHelpDto = new AskForHelpDto
                        {
                            Details = askForHelpEvent.details,
                            Latitude = askForHelpEvent.latitude,
                            Longitude = askForHelpEvent.longitude,
                            Picture = askForHelpEvent.picture,
                            Traveler_id = askForHelpEvent.traveler_id,
                            SerialTypeNumber = askForHelpEvent.serialTypeNumber,
                            CountryNumber = askForHelpEvent.country_number,
                            AreaNumber = askForHelpEvent.area_number,
                            event_date = askForHelpEvent.event_date,
                            event_time = askForHelpEvent.event_time,
                            Traveler = new TravelerDto
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
                            }
                        };

                        askForHelpEventsWithin1Km.Add(askForHelpDto);
                    }
                }

                // If no matching events were found, return a not found response
                if (askForHelpEventsWithin1Km.Count == 0)
                {
                    return Ok("There are no help requests in your area");
                }

                return Ok(askForHelpEventsWithin1Km);
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
                    x => new AskForHelpDto { 
                     Details = x.details,
                    Latitude = x.latitude,
                    Longitude = x.longitude,
                    Picture = x.picture,
                    event_date= x.event_date,
                    event_time = x.event_time,
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

        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            // Implementation of the Haversine formula
            const double R = 6371; // Earth radius in kilometers
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = R * c;
            return distance;
        }
    }
}
