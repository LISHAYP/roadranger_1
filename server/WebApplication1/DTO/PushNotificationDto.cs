using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class PushNotificationDto
    {
        public int EventId { get; set; }
        public int TravelerId { get; set; }
        public bool Sent { get; set; }
        public string Token { get; set; }
        public int id { get; set; }

    }
}