using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using data;
using NLog;
using WebApplication1;

namespace WebApplication1.Controllers
{
    public class ConversationController : ApiController
    {
        readonly igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


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
                        CreatedAt = conversation.created_at,
                        message=conversation.message
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
        public IHttpActionResult StartConversation(int userOneId, int userTwoId)
        {
            // Check that both user IDs are present and not null
            if (userOneId.ToString() == null || userTwoId.ToString() == null)
            {
                return BadRequest("Both userOneId and userTwoId are required.");
            }
            try
            {
                // Retrieve the user information for both user IDs
                var userOne = db.traveleres.Find(userOneId);
                var userTwo = db.traveleres.Find(userTwoId);

                // Create a new conversation record in the database
                var conversation = new tblConversationTravelers
                {
                    User_one = userOneId,
                    User_two = userTwoId,
                    created_at = DateTime.Now,
                
                };

                db.tblConversationTravelers.Add(conversation);
                db.SaveChanges();

                // Create a response for the conversation
                var conversationResponse = new
                {
                    ChatId = conversation.ChatId,
                    UserOneId = conversation.User_one,
                    UserTwoId = conversation.User_two,
                    UserOneName = userOne.first_name, // replace "Name" with the actual property name for the user's name
                    UserTwoName = userTwo.first_name, // replace "Name" with the actual property name for the user's name
                    CreatedAt = conversation.created_at
                };

                return Ok(conversationResponse);
            }

             catch (Exception)
    {
        return BadRequest("An error occurred while starting the conversation.");
    }
        }
        [HttpPost]
        [Route("api/AddMessage")]
        public IHttpActionResult AddMessage(int chatId, int senderId, string message)
        {
            try
            {
                 

                // Query the database to get the conversation record
                var conversation = db.tblConversationTravelers.FirstOrDefault(c => c.ChatId == chatId);

                // Append the new message to the conversation
                conversation.message += $"{message}";
                db.tblConversationTravelers.Add(conversation);
                db.SaveChanges();

                return Ok(conversation);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [HttpGet]
        [Route("api/GetMessages")]
        public IHttpActionResult GetMessages(int chatId)
        {
            try
            {
                // Query the database to get the conversation record
                var conversation = db.tblConversationTravelers.FirstOrDefault(c => c.ChatId == chatId);

                // Split the message string into individual messages
                var messages = new List<object>();
                var messageStrings = conversation.message.Split(';');
                foreach (var messageString in messageStrings)
                {
                    var parts = messageString.Split(':');
                    if (parts.Length == 2 && int.TryParse(parts[0], out int senderId))
                    {
                        var messageResponseItem = new
                        {
                            SenderId = senderId,
                            Message = parts[1],
                            CreatedAt = conversation.created_at // Use the conversation's created_at date as the message's created_at date
                        };

                        messages.Add(messageResponseItem);
                    }
                }

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }






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
