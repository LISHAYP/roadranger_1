using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;

namespace WebApplication1.Controllers
{
    public class CommentController : ApiController
    {
        igroup190_test1Entities2 db = new igroup190_test1Entities2();

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
        public IHttpActionResult PostComment([FromBody] tblComment value)
        {
            try
            {
                tblComment NewComment = new tblComment
                {
                    commentNumber = value.commentNumber,
                    eventNumber = value.eventNumber,
                    details = value.details,
                    comment_date = value.comment_date,
                    comment_time = value.comment_time,
                    travelerId = value.travelerId,
                    stackholderId = value.stackholderId
                };
                db.tblComments.Add(NewComment);
                db.SaveChanges();
                return Ok("New comment was created");
            }
            catch (Exception ex)
            {

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
