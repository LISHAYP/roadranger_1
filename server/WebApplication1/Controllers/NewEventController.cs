using data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class NewEventController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

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
                    AreaNumber = newevent.area_number
                };
                eventsDto.Add(eventDto);
            }
            return eventsDto;
        }

        // GET: api/NewEvent/5
        public string Get(int id)
        {
            return "value";
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
                    area_number = value.area_number
                };

                db.tblEvents.Add(newEvent);
                db.SaveChanges();
                return Ok("New event created successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message);
            }
        }


        [HttpPost]
<<<<<<< HEAD
        [Route("api/post/neweventwithpicture")]
        public async Task<IHttpActionResult> PostNewEvent()
        {
            try
            {
                // Check if the request contains multipart/form-data.
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return BadRequest("Unsupported media type");
                }

                // Set the path for storing uploaded files.
                var root = HttpContext.Current.Server.MapPath("~/App_Data/uploads");
                Directory.CreateDirectory(root);
                var provider = new MultipartFormDataStreamProvider(root);

                // Read the form data and store the files.
                await Request.Content.ReadAsMultipartAsync(provider);

                // Get the event data from the request.
                var formData = provider.FormData;
                var eventData = new tblEvents
                {

                    eventNumber = int.Parse(formData.Get("eventNumber")),
                    details = formData.Get("details"),
                    event_date = DateTime.Parse(formData.Get("event_date")),
                    event_time = TimeSpan.Parse(formData.Get("event_time")),
                    latitude = (decimal)double.Parse(formData.Get("latitude")),
                    longitude = (decimal)double.Parse(formData.Get("longitude")),
                    event_status = bool.TryParse(formData.Get("event_status"), out bool status) ? status : false,
                    travelerId = int.Parse(formData.Get("travelerId")),
                    stackholderId = int.Parse(formData.Get("stackholderId")),
                    serialTypeNumber = int.Parse(formData.Get("serialTypeNumber")),
                    country_number = int.Parse(formData.Get("country_number")),
                    area_number = int.Parse(formData.Get("area_number")),
                    picture = formData.Get("picture")


                };

                // Upload the picture and set the picture property of the event data.
                if (provider.FileData.Count > 0)
                {
                    var fileData = provider.FileData[0];
                    var fileName = fileData.Headers.ContentDisposition.FileName.Replace("\"", string.Empty);
                    var fileExtension = Path.GetExtension(fileName);
                    var newFileName = $"{Guid.NewGuid()}{fileExtension}";
                    var filePath = Path.Combine(root, newFileName);
                    Console.WriteLine($"File uploaded to {filePath}");
                    File.Move(fileData.LocalFileName, filePath);
                    eventData.picture = $"/App_Data/uploads/{newFileName}";


                }

                // Save the event data to the database.
                db.tblEvents.Add(eventData);
                db.SaveChanges();

                return Ok("New event created successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message);
            }
        }

        [HttpPost]
        [Route("api/events/comments")]
        public IHttpActionResult GetCommentsForEvent([FromBody]CommentDto eventId)
        {
            try
            {
=======
        [Route("api/events/comments")]
        public IHttpActionResult GetCommentsForEvent([FromBody]CommentDto eventId)
        {
            try
            {
>>>>>>> 4850f99df510b32afa6b6de130ddabe2707b82c2
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
                                                  StakeholderName = c.stakeholders.stakeholder_name
                                              }).ToList();

                return Ok(comments);
            }
            catch (Exception ex)
            {
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

                // Save the changes to the database
                db.SaveChanges();

                return Ok("Event updated successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message);
            }
        }

        // PUT: api/NewEvent/5
        public void Put(int id, [FromBody] string value)
        {

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

                // Delete the event from the database
                db.tblEvents.Remove(eventToDelete);
                db.SaveChanges();

                // Return a success message
                return Ok("Event deleted successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException.Message);
            }
        }


    }

}

