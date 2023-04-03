using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;

namespace WebApplication1.Controllers
{
    public class ConversationController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

        // GET: api/Conversation
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Conversation/5
        [HttpGet]
        [Route("api/GetConversations")]
        public IHttpActionResult GetConversations(int userOneId, int userTwoId)
        {

            try
            {
                // Query the database to get all conversations between the two users
                var conversations = db.tblConversationTravelers.Where(c => (c.User_one == userOneId && c.User_two == userTwoId) || (c.User_one == userTwoId && c.User_two == userOneId)).ToList();

                var conversationResponse = new List<object>();
                foreach (var conversation in conversations)
                {
                    var conversationResponseItem = new
                    {
                        ChatId = conversation.ChatId,
                        UserOneId = conversation.User_one,
                        UserTwoId = conversation.User_two,
                        CreatedAt = conversation.created_at
                    };

                    conversationResponse.Add(conversationResponseItem);
                }

                return Ok(conversationResponse);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST: api/Conversation
        [HttpPost]
        [Route("api/StartConversation")]
        public IHttpActionResult StartConversation( int userOneId, int userTwoId)
        {
            try
            {
                // Create a new conversation record in the database
                var conversation = new tblConversationTravelers
                {
                    User_one = userOneId,
                    User_two = userTwoId,
                    created_at = DateTime.Now
                };

                db.tblConversationTravelers.Add(conversation);
                db.SaveChanges();

                var conversationResponse = new
                {
                    UserOneId = conversation.User_one,
                    UserTwoId = conversation.User_two,
                    CreatedAt = conversation.created_at
                };

                return Ok(conversation);
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while starting the conversation.");
            }
        }
        //[HttpPost]
        //[Route("api/AddMessage")]
        //public IHttpActionResult AddMessage([FromBody]int chatId, int senderId, string message)
        //{
        //    try
        //    {
        //        // Query the database to get the conversation record
        //        var conversation = db.tblConversationTravelers.FirstOrDefault(c => c.ChatId == chatId);

        //        // Append the new message to the conversation
        //        conversation.Messages += $"{senderId}:{message};";
        //        db.SaveChanges();

        //        return Ok(conversation);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}
        //[HttpGet]
        //[Route("api/GetMessages")]
        //public IHttpActionResult GetMessages(int chatId)
        //{
        //    try
        //    {
        //        // Query the database to get the conversation record
        //        var conversation = db.tblConversationTravelers.FirstOrDefault(c => c.ChatId == chatId);

        //        // Split the message string into individual messages
        //        var messages = new List<object>();
        //        var messageStrings = conversation.Messages.Split(';');
        //        foreach (var messageString in messageStrings)
        //        {
        //            var parts = messageString.Split(':');
        //            if (parts.Length == 2 && int.TryParse(parts[0], out int senderId))
        //            {
        //                var messageResponseItem = new
        //                {
        //                    SenderId = senderId,
        //                    Message = parts[1],
        //                    CreatedAt = conversation.created_at // Use the conversation's created_at date as the message's created_at date
        //                };

        //                messages.Add(messageResponseItem);
        //            }
        //        }

        //        return Ok(messages);
        //    }
        //    catch (Exception ex)
        //    {
        //        return InternalServerError(ex);
        //    }
        //}






        // PUT: api/Conversation/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Conversation/5
        public void Delete(int id)
        {
        }
    }
}
