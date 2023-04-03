using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ConversationControllerDto
    {
        public class ConversationDTO
        {
            public int ChatId { get; set; }
            public int UserOneId { get; set; }
            public int UserTwoId { get; set; }
            public DateTime CreatedAt { get; set; }
            public List<MessageDTO> Messages { get; set; }
        }

        public class MessageDTO
        {
            public int SenderId { get; set; }
            public string MessageText { get; set; }
            public DateTime CreatedAt { get; set; }
        }
    }
}