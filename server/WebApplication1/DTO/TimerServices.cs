using data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace WebApplication1.DTO
{
    public class TimerServices
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();

        // Method to be executed by the timer
        public void SendPushForEvent(EventDto eventDto)
        {
            try
            {
                if (eventDto.SerialTypeNumber == 1003 || eventDto.SerialTypeNumber == 1004)
                {
                     SendPushNotificationToAll(eventDto.SerialTypeNumber,(int)eventDto.TravelerId);
                }
                else
                {
                    var travelerIdsWithin3km = GetTravelerIdsWithin3km(eventDto.Latitude, eventDto.Longitude);

                    // Remove the traveler who opened the event from the list
                    travelerIdsWithin3km.Remove((int)eventDto.TravelerId);

                    SendPushNotification(travelerIdsWithin3km, eventDto.SerialTypeNumber);
                }
            }
            catch (Exception ex)
            {
                logger.Info(ex);
            }
        }

        public List<int> GetTravelerIdsWithin3km(decimal latitude, decimal longitude)
        {
            var lastLocations = db.tblLocations
                .GroupBy(l => l.travelerId)
                .Select(g => g.OrderByDescending(l => l.dateAndTime).FirstOrDefault())
                .ToList();

            var travelerIdsWithin3km = new List<int>();

            foreach (var location in lastLocations)
            {
                decimal travelerLatitude = location.latitude;
                decimal travelerLongitude = location.longitude;

                double distance = CalculateDistance((double)latitude, (double)longitude, (double)travelerLatitude, (double)travelerLongitude);

                if (distance <= 3)
                {
                    travelerIdsWithin3km.Add(location.travelerId);
                }
            }

            return travelerIdsWithin3km;
        }

        public void SendPushNotification(List<int> travelerIds, int serialTypeNumber)
        {
            try
            {
                var travelers = db.traveleres.Where(t => travelerIds.Contains(t.traveler_id)).ToList();

                // Create the push notification data
                var pushNotificationData = new PushNotData
                {
                    title = "New Event Update",
                    body = "You are within 3 km of a new event, check it out on the map!"
                };

                //if (serialTypeNumber == 1003)
                //{
                //    pushNotificationData.title = "Missing Traveler";
                //    pushNotificationData.body = "A traveler is reported missing. Please be cautious and report any information you may have.";
                //}
                //else if (serialTypeNumber == 1004)
                //{
                //    pushNotificationData.title = "Travel warning";
                //    pushNotificationData.body = "A travel warning has been issued for your current location. Stay safe and follow local authorities' instructions.";
                //}

                foreach (var traveler in travelers)
                {
                    pushNotificationData.to = traveler.token;
                    _=PostPN(pushNotificationData, traveler.traveler_id, serialTypeNumber);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
        }

        public  void SendPushNotificationToAll(int serialTypeNumber, int excludingTravelerId)
        {
            try
            {
                var travelers = db.traveleres.Where(t => t.traveler_id != excludingTravelerId).ToList();

                // Create the push notification data
                var pushNotificationData = new PushNotData();
                //{
                //    title = "New Event Update",
                //    body = "You are within 3 km of a new event, check it out on the map!"
                //};

                if (serialTypeNumber == 1003)
                {
                    pushNotificationData.title = "Missing Traveler";
                    pushNotificationData.body = "A traveler is reported missing. Please be cautious and report any information you may have.";
                }
                else if (serialTypeNumber == 1004)
                {
                    pushNotificationData.title = "Travel warning";
                    pushNotificationData.body = "A travel warning has been issued for your current location. Stay safe and follow local authorities' instructions.";
                }

                foreach (var traveler in travelers)
                {
                    if (traveler.token != null)
                    {
                        pushNotificationData.to = traveler.token;
                        _ = PostPN(pushNotificationData, traveler.traveler_id, serialTypeNumber);
                    }
                }

            
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }
        }


        public async Task PostPN(PushNotData pushNotificationData, int travelerId, int eventId)
        {
            using (var client = new HttpClient())
            {
                // Specify the API endpoint URL
                string apiUrl = "https://exp.host/--/api/v2/push/send";

                // Serialize the push notification data to JSON
                string jsonData = JsonConvert.SerializeObject(pushNotificationData);

                // Create the request content with JSON data
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                try
                {
                    // Send the POST request and get the response
                    HttpResponseMessage response = await client.PostAsync(apiUrl, content).ConfigureAwait(false);

                    // Ensure the request was successful
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    string responseContent = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                    // Log the response and save push notification information in the database
                    await LogPushNotificationResponse(travelerId, eventId, responseContent);
                }
                catch (Exception ex)
                {
                    logger.Error(ex.Message);
                    // Log the exception message
                    logger.Error("Exception occurred during the POST request: " + ex.Message);
                    // Handle any exceptions that occurred during the request
                    // You can return an error message or throw the exception again
                    string errorMessage = "error: " + ex.Message;
                    await LogPushNotificationResponse(travelerId, eventId, errorMessage);
                }
            }
        }

        public Task LogPushNotificationResponse(int travelerId, int eventId, string response)
        {
            try
            {
                using (igroup190_test1Entities db = new igroup190_test1Entities())
                {
                    var traveler = db.traveleres.FirstOrDefault(t => t.traveler_id == travelerId);
                    if (traveler != null)
                    {
                        logger.Info("Push notification sent to traveler ID: " + travelerId + ", Event ID: " + eventId + ", Response: " + response);

                        // Deserialize the response JSON
                        var responseJson = JObject.Parse(response);

                        // Extract the value of the 'status' property
                        var status = responseJson["data"]["status"].ToString();

                        // Save push notification information in the database
                        if (status == "ok") // Modify this condition based on the actual response from the push notification service
                        {
                            var pushNotificationDto = new PushNotificationDto
                            {
                                EventId = eventId,
                                TravelerId = travelerId,
                                Sent = true,
                                Token = traveler.token
                            };

                            // Map the DTO to the entity and save it to the database
                            var pushNotificationEntity = new pushnotifications
                            {
                                eventid = pushNotificationDto.EventId,
                                travelerid = pushNotificationDto.TravelerId,
                                sent = pushNotificationDto.Sent,
                                token = pushNotificationDto.Token
                            };

                            db.pushnotifications.Add(pushNotificationEntity);
                            db.SaveChanges();

                            logger.Info("Push notification sent to traveler ID: " + travelerId + ", Event ID: " + eventId);
                        }
                        else
                        {
                            logger.Info("Push notification failed for traveler ID: " + travelerId + ", Event ID: " + eventId + ", Status: " + status);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
            }

            return Task.CompletedTask;
        }


        public static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
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

    }
}
