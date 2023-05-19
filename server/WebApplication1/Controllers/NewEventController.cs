using data;
using Microsoft.AspNetCore.Mvc;
using NLog;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{

    public class NewEventController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


        // GET: api/NewEvent
        public IEnumerable<EventDto> Get()
        {

            List<tblEvents> events = db.tblEvents.ToList();
            List<EventDto> eventsDto = new List<EventDto>();

            foreach (var newevent in events)
            {
                EventDto eventDto = new EventDto
                {
                    eventNumber = newevent.eventNumber,
                    Details = newevent.details,
                    EventDate = newevent.event_date,
                    EventTime = newevent.event_time,
                    Latitude = newevent.latitude,
                    Longitude = newevent.longitude,
                    EventStatus = newevent.event_status,
                    Picture = newevent.picture,
                    TravelerId = newevent.travelerId,
                    StackholderId = newevent.stackholderId,
                    SerialTypeNumber = newevent.serialTypeNumber,
                    CountryNumber = newevent.country_number,
                    AreaNumber = newevent.area_number,
                    labels = newevent.labels,
                    is_related = newevent.is_related
                };
                eventsDto.Add(eventDto);
            }
            return eventsDto;
        }

        // GET: api/NewEvent?travelerId={travelerId}
        public IEnumerable<EventDto> Get(int travelerId)
        {
            try
            {
                // Retrieve the last known location of the traveler
                var lastLocation = db.tblLocations
                    .Where(l => l.travelerId == travelerId)
                    .OrderByDescending(l => l.dateAndTime)
                    .Select(l => new { l.latitude, l.longitude })
                    .FirstOrDefault();

                if (lastLocation == null)
                {
                    // No location data found for the given traveler
                    return Enumerable.Empty<EventDto>();
                }

                // Fetch events and calculate distance to the last known location of the traveler
                var events = db.tblEvents.ToList();
                var nearbyEvents = events
                    .Where(e => e.event_status == true)
                    .Select(e => new { Event = e, Distance = CalculateDistance((double)lastLocation.latitude, (double)lastLocation.longitude, (double)e.latitude, (double)e.longitude) })
                    .Where(e => e.Distance <= 0.1)
                    .Select(e => new EventDto
                    {
                        eventNumber = e.Event.eventNumber,
                        Details = e.Event.details,
                        EventDate = e.Event.event_date,
                        EventTime = e.Event.event_time,
                        Latitude = e.Event.latitude,
                        Longitude = e.Event.longitude,
                        EventStatus = e.Event.event_status,
                        Picture = e.Event.picture,
                        TravelerId = e.Event.travelerId,
                        StackholderId = e.Event.stackholderId,
                        SerialTypeNumber = e.Event.serialTypeNumber,
                        CountryNumber = e.Event.country_number,
                        AreaNumber = e.Event.area_number,
                        labels = e.Event.labels,
                        is_related = (int)e.Event.is_related
                    })
                    .ToList();

                logger.Info($"events within 100 meters from the traveler number: {travelerId}");
                return nearbyEvents;

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return (IEnumerable<EventDto>)BadRequest(ex.InnerException.Message);
            }
        }

        // POST: api/NewEvent
        [HttpPost]
        [Route("api/post/newevent")]
        public IHttpActionResult PostNewEvent([FromBody] tblEvents value)
        {
            try
            {
                tblEvents newEvent = new tblEvents
                {
                    eventNumber = value.eventNumber,
                    details = value.details,
                    event_date = value.event_date,
                    event_time = value.event_time,
                    latitude = value.latitude,
                    longitude = value.longitude,
                    event_status = value.event_status,
                    picture = value.picture,
                    travelerId = value.travelerId,
                    stackholderId = value.stackholderId,
                    serialTypeNumber = value.serialTypeNumber,
                    country_number = value.country_number,
                    area_number = value.area_number,
                    labels = value.labels,
                    is_related = value.is_related,

                };

                db.tblEvents.Add(newEvent);
                db.SaveChanges();
                logger.Info("new event was added to the database!");

                // Retrieve the name and picture of the user who posted the event
                string userName = "";
                string userPicture = "";
                if (newEvent.travelerId.HasValue)
                {
                    var traveler = db.traveleres.FirstOrDefault(t => t.traveler_id == newEvent.travelerId.Value);
                    if (traveler != null)
                    {
                        userName = traveler.first_name + " " + traveler.last_name;
                        userPicture = traveler.picture;
                    }
                }
                else if (newEvent.stackholderId.HasValue)
                {
                    var stakeholder = db.stakeholders.FirstOrDefault(s => s.stakeholder_id == newEvent.stackholderId.Value);
                    if (stakeholder != null)
                    {
                        userName = stakeholder.full_name;
                        userPicture = stakeholder.picture;
                    }
                }

                // Construct the response message
                var responseMessage = new
                {
                    message = "New event created successfully!",
                    userName = userName,
                    userPicture = userPicture
                };

                return Ok(responseMessage);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.InnerException.Message);
            }
        }

        //[HttpPost]
        //[Route("api/post/neweventdistance")]
        //public IHttpActionResult PostNewEventDistance([FromBody] tblEvents newEvent)
        //{
        //    try
        //    {

        //        // Check if there are any existing events within 3 km with the same serialTypeNumber
        //        var existingEvents = db.tblEvents
        //            .Where(e => e.serialTypeNumber == newEvent.serialTypeNumber
        //                        && e.event_status == true) // only consider events with status "true"
        //            .ToList()
        //            .Where(e => CalculateDistance((double)e.latitude, (double)e.longitude, (double)newEvent.latitude, (double)newEvent.longitude) <= 3)
        //            .ToList();

        //        // Detach deleted entities from the context
        //        var deletedEntities = existingEvents.Where(e => db.Entry(e).State == EntityState.Deleted).ToList();
        //        if (deletedEntities.Any())
        //        {
        //            foreach (var deletedEntity in deletedEntities)
        //            {
        //                db.Entry(deletedEntity).State = EntityState.Detached;
        //            }
        //        }

        //        if (existingEvents.Any())
        //        {
        //            // Create a relation between the new event and any existing events within 3 km
        //            foreach (var existingEvent in existingEvents)
        //            {
        //                // Detach the existingEvent entity from the context
        //                db.Entry(existingEvent).State = EntityState.Detached;

        //                // Create the relationship between the newEvent and the existingEvent
        //                newEvent.tblEvents1 = existingEvent;
        //                existingEvent.tblEvents2 = newEvent;
        //            }
        //        }

        //        // Generate a new event number that doesn't conflict with any existing event numbers
        //        int maxEventNumber = db.tblEvents.Max(e => e.eventNumber);
        //        newEvent.eventNumber = maxEventNumber + 1;

        //        // Add the new event to the database
        //        db.tblEvents.Add(newEvent);

        //        // Save changes to the database
        //        db.SaveChanges();
        //        return Ok();

        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex.Message);
        //        return BadRequest();
        //    }
        //}

        //[HttpPost]
        //[Route("api/post/neweventdistance")]
        //public IHttpActionResult PostNewEventDistance([FromBody] tblEvents newEvent)
        //{
        //    try
        //    {

        //        // Check if there are any existing events within 3 km with the same serialTypeNumber
        //        var existingEvents = db.tblEvents
        //            .Where(e => e.serialTypeNumber == newEvent.serialTypeNumber
        //                        && e.event_status == true) // only consider events with status "true"
        //            .ToList()
        //            .Where(e => CalculateDistance((double)e.latitude, (double)e.longitude, (double)newEvent.latitude, (double)newEvent.longitude) <= 3)
        //            .ToList();

        //        return Ok(existingEvents);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.Error(ex.Message);
        //        return BadRequest();
        //    }
        //}
        [HttpPost]
        [Route("api/post/neweventdistance")]
        public IHttpActionResult PostNewEventDistance([FromBody] tblEvents newEvent)
        {
            try
            {
                // Check if there are any existing events within 3 km with the same serialTypeNumber
                var existingEvents = db.tblEvents
                    .Where(e => e.serialTypeNumber == newEvent.serialTypeNumber && e.event_status == true)
                    .ToList()
                    .Where(e => CalculateDistance((double)e.latitude, (double)e.longitude, (double)newEvent.latitude, (double)newEvent.longitude) <= 3)
                    .Select(e => new EventDto
                    {
                        eventNumber = e.eventNumber,
                        Details = e.details,
                        EventDate = e.event_date,
                        EventTime = e.event_time,
                        Latitude = e.latitude,
                        Longitude = e.longitude,
                        EventStatus = e.event_status,
                        Picture = e.picture,
                        TravelerId = e.travelerId,
                        StackholderId = e.stackholderId,
                        SerialTypeNumber = e.serialTypeNumber,
                        CountryNumber = e.country_number,
                        AreaNumber = e.area_number,
                        labels = e.labels,
                        is_related = e.is_related
                    })
                    .ToList();

                return Ok(existingEvents);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("api/post/relatedevents")]
        public IHttpActionResult PostRelatedEvents([FromBody] tblEvents newEvent)
        {
            try
            {
                // Retrieve the events where the event number appears in the "is_related" column
                var relatedEvents = db.tblEvents
                    .Where(e => e.is_related == newEvent.eventNumber || e.eventNumber == newEvent.eventNumber)
                    .OrderBy(e => e.event_date)
                    .ThenBy(e => e.event_time)
                    .Select(e => new EventDto
                    {
                        eventNumber = e.eventNumber,
                        Details = e.details,
                        EventDate = e.event_date,
                        EventTime = e.event_time,
                        Latitude = e.latitude,
                        Longitude = e.longitude,
                        EventStatus = e.event_status,
                        Picture = e.picture,
                        TravelerId = e.travelerId,
                        StackholderId = e.stackholderId,
                        SerialTypeNumber = e.serialTypeNumber,
                        CountryNumber = e.country_number,
                        AreaNumber = e.area_number,
                        labels = e.labels,
                        is_related = e.is_related
                    })
                    .ToList();

                return Ok(relatedEvents);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }




        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
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


        [HttpPost]
        [Route("api/events/comments")]
        public IHttpActionResult GetCommentsForEvent([FromBody] CommentDto eventId)
        {
            try
            {
                var comments = db.tblComments.Where(c => c.eventNumber == eventId.EventNumber)
                                              .Select(c => new CommentDto
                                              {
                                                  CommentNumber = c.commentNumber,
                                                  EventNumber = c.eventNumber,
                                                  Details = c.details,
                                                  CommentDate = c.comment_date,
                                                  CommentTime = c.comment_time,
                                                  TravelerId = c.travelerId,
                                                  StackholderId = c.stackholderId,
                                                  TravelerName = c.traveleres.first_name + c.traveleres.last_name,
                                                  StakeholderName = c.stakeholders.stakeholder_name,
                                                  picture = c.traveleres.picture,
                                                  shpicture = c.stakeholders.picture

                                              }).ToList();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return InternalServerError(ex);
            }
        }

        // POST api/post/updateevent
        [HttpPost]
        [Route("api/post/updateevent")]
        public IHttpActionResult PostUpdateEvent([FromBody] tblEvents updatedEvent)
        {
            try
            {
                // Retrieve the existing event from the database
                tblEvents existingEvent = db.tblEvents.FirstOrDefault(x => x.eventNumber == updatedEvent.eventNumber);

                // If the existing event does not exist, return a bad request
                if (existingEvent == null)
                {
                    return BadRequest("Event not found.");
                }

                // Update the existing event with the new values
                existingEvent.details = updatedEvent.details;
                existingEvent.event_date = updatedEvent.event_date;
                existingEvent.event_time = updatedEvent.event_time;
                existingEvent.latitude = updatedEvent.latitude;
                existingEvent.longitude = updatedEvent.longitude;
                existingEvent.event_status = updatedEvent.event_status;
                existingEvent.picture = updatedEvent.picture;
                existingEvent.travelerId = updatedEvent.travelerId;
                existingEvent.stackholderId = updatedEvent.stackholderId;
                existingEvent.serialTypeNumber = updatedEvent.serialTypeNumber;
                existingEvent.country_number = updatedEvent.country_number;
                existingEvent.area_number = updatedEvent.area_number;
                existingEvent.labels = updatedEvent.labels;
                existingEvent.is_related = updatedEvent.is_related;

                // Save the changes to the database
                db.SaveChanges();
                logger.Info($"event number {updatedEvent.eventNumber} was updated and saved to the databsae!");

                return Ok("Event updated successfully!");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.InnerException.Message);
            }
        }

        // POST: api/LastEvent
        [HttpPost]
        [Route("api/post/lastevent")]
        public IHttpActionResult GetLastEventId([FromBody] tblEvents travelerId)
        {
            try
            {
                tblEvents lastEvent = db.tblEvents
                    .Where(e => e.travelerId == travelerId.travelerId)
                    .OrderByDescending(e => e.event_date)
                    .ThenByDescending(e => e.event_time)
                    .FirstOrDefault();

                int lastEventId = lastEvent != null ? lastEvent.eventNumber : 0;

                // Construct the response message
                var responseMessage = new
                {
                    lastEventId = lastEventId
                };

                return Ok(responseMessage);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.InnerException.Message);
            }
        }



        // PUT: api/NewEvent/5
        public void Put(int id, [FromBody] string value)
        {

        }

        // PUT api/put/updateevent/{eventNumber}
        [HttpPut]
        [Route("api/put/updateevent/{eventNumber}")]
        public IHttpActionResult PutUpdateEvent(int eventNumber, [FromBody] tblEvents isRelated)
        {
            try
            {
                // Retrieve the existing event from the database
                tblEvents existingEvent = db.tblEvents.FirstOrDefault(x => x.eventNumber == eventNumber);

                // If the existing event does not exist, return a bad request
                if (existingEvent == null)
                {
                    return BadRequest("Event not found.");
                }

                // Update the existing event's "is_related" field with the new value
                existingEvent.is_related = isRelated.is_related;

                // Save the changes to the database
                db.SaveChanges();
                logger.Info($"Event number {eventNumber} was updated and saved to the database!");

                return Ok("Event updated successfully!");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.InnerException.Message);
            }
        }
        [HttpPut]
        [Route("api/put/eventapproval/{eventNumber}")]
        public IHttpActionResult UpdateEventApproval(int eventNumber, EventDto approvalDto)
        {
            try
            {
                // Retrieve the event based on the event number
                var eventToUpdate = db.tblEvents.FirstOrDefault(e => e.eventNumber == eventNumber);

                if (eventToUpdate == null)
                {
                    return NotFound(); // Event not found
                }

                // Validate the input values
                if (approvalDto.approved != 0 && approvalDto.approved != 1)
                {
                    return BadRequest("Invalid value for 'approved'. Only 0 or 1 are allowed.");
                }

                if (approvalDto.not_approved != 0 && approvalDto.not_approved != 1)
                {
                    return BadRequest("Invalid value for 'not_approved'. Only 0 or 1 are allowed.");
                }

                if ((approvalDto.approved == 0 && approvalDto.not_approved == 0) ||
                    (approvalDto.approved == 1 && approvalDto.not_approved == 1))
                {
                    return BadRequest("Invalid combination of values. 'approved' and 'not_approved' cannot have the same value.");
                }

                // Update the event approval status
                eventToUpdate.approved += approvalDto.approved;
                eventToUpdate.not_approved += approvalDto.not_approved;

                db.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest();
            }
        }


        public class EventApprovalDto
        {
            public int Approved { get; set; }
            public int NotApproved { get; set; }
        }



        // DELETE: api/NewEvent/5
        public void Delete(int id)
        {

        }

        [HttpDelete]
        [Route("api/deleteevent")]
        public IHttpActionResult DeleteEvent([FromBody] tblEvents value)
        {
            try
            {
                // Find the event to delete by traveler ID and event ID
                var eventToDelete = db.tblEvents.SingleOrDefault(x => x.travelerId == value.travelerId && x.eventNumber == value.eventNumber);

                // If no event was found with the given traveler ID and event ID, return a not found response
                if (eventToDelete == null)
                {
                    return NotFound();
                }

                var commentsToDelete = db.tblComments.Where(x => x.eventNumber == value.eventNumber).ToList();
                db.tblComments.RemoveRange(commentsToDelete);

                // Delete the event from the database
                db.tblEvents.Remove(eventToDelete);
                db.SaveChanges();

                // Return a success message
                logger.Info($"event number {eventToDelete.eventNumber} deleted succesfully! ");
                return Ok("Event deleted successfully!");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.InnerException.Message);
            }
        }

        [HttpPost]
        [Route("sendpushnotification")]
        public string PostPN([FromBody] PushNotData pnd)
        {
            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create("https://exp.host/--/api/v2/push/send");
            // Set the Method property of the request to POST.  
            request.Method = "POST";
            // Create POST data and convert it to a byte array.  
            var objectToSend = new
            {
                to = pnd.to,
                title = pnd.title,
                body = pnd.body,
            };

            string postData = new JavaScriptSerializer().Serialize(objectToSend);

            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/json";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;
            // Get the request stream.  
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.  
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.  
            dataStream.Close();
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            string returnStatus = ((HttpWebResponse)response).StatusDescription;
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams.  
            reader.Close();
            dataStream.Close();
            response.Close();

            return "success:) --- " + responseFromServer + ", " + returnStatus;
        }

    }

}

