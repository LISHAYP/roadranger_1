using FirebaseAdmin.Messaging;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Threading;

namespace WebApplication1.DTO
{
    public class FcmService
    {
        private readonly FirebaseMessaging _messaging;

        public FcmService()
        {
            // Initialize the FirebaseApp with your project credentials
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(@"C:\Users\USER\OneDrive\שולחן העבודה\מנהל עסקים\שנה ג\פרויקט גמר מערכות מידע\roadrangetchat-firebase-adminsdk-gdti0-c7ed5ae7a4.json")

            });

            // Get a reference to the FirebaseMessaging service
            _messaging = FirebaseMessaging.DefaultInstance;
        }


        public async Task<string> SendNotificationToAllTravelers(string title, string body, Dictionary<string, string> data)
        {
            // Construct the message payload
            var message = new Message
            {
                Notification = new Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data,
                Topic = "all_travelers"
            };


            // Send the message to the specified topic
            var response = await _messaging.SendAsync(message, new CancellationToken());

            // Get the message ID from the response
            return response;

          

        }
    }
}
