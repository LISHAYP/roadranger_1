using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class PushNotData
    {
        public string to { get; set; } // the recipient of the push notification
        public string title { get; set; } // the title of the push notification
        public string body { get; set; } // the body text of the push notification
        public int badge { get; set; } // the badge count to display on the app icon
    }

}