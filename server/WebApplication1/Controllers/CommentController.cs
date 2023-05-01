using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using NLog;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class CommentController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


        // GET: api/Comment
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Comment/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Comment
        [HttpPost]
        [Route("api/newcomment")]
        public IHttpActionResult PostComment([FromBody] tblComments value)
        {
            try
            {
                tblComments newComment = new tblComments
                {
                    eventNumber = value.eventNumber,
                    details = value.details,
                    comment_date = value.comment_date,
                    comment_time = value.comment_time,
                    travelerId = value.travelerId,
                    stackholderId = value.stackholderId
                };

                db.tblComments.Add(newComment);
                db.SaveChanges();

                // Get the name and picture of the traveler or stakeholder who posted the comment
                string name = "";
                string picture = "";

                if (newComment.travelerId != null)
                {
                    var traveler = db.traveleres.Find(newComment.travelerId);
                    if (traveler != null)
                    {
                        name = traveler.first_name + " " + traveler.last_name;
                        picture = traveler.picture;
                    }
                }
                else if (newComment.stackholderId != null)
                {
                    var stakeholder = db.stakeholders.Find(newComment.stackholderId);
                    if (stakeholder != null)
                    {
                        name = stakeholder.full_name;
                        picture = stakeholder.picture;
                    }
                }

                // Return the response with the name and picture of the traveler or stakeholder
                var response = new
                {
                    message = "New comment was created",
                    commenterName = name,
                    commenterPicture = picture
                };

                logger.Info($"new comment was added to event number: {newComment.eventNumber}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Comment
        [HttpDelete]
        [Route("api/deletecomment")]
        public IHttpActionResult DeleteComment([FromBody] CommentDto dcomment)
        {
            try
            {
                var comment = db.tblComments.Find(dcomment.CommentNumber);
                if (comment == null)
                {
                    return NotFound();
                }

                db.tblComments.Remove(comment);
                db.SaveChanges();

                logger.Info($"comment {dcomment.CommentNumber} was deleted");
                return Ok($"comment number {dcomment.CommentNumber} was deleted");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest(ex.Message);
            }
        } 
        // PUT: api/Comment/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Comment/5
        public void Delete(int id)
        {
        }
    }
}
