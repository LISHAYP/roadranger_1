using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class TravelerDto
    {
        public int traveler_id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string travler_email { get; set; }
        public Nullable<int> phone { get; set; }
        public Nullable<bool> notifications { get; set; }
        public string insurence_company { get; set; }
        public Nullable<bool> location { get; set; }
        public Nullable<bool> save_location { get; set; }
        public System.DateTime dateOfBirth { get; set; }
        public string gender { get; set; }
        public string password { get; set; }
        public Nullable<bool> chat { get; set; }
        public string Picture { get; set; }
        public string token { get; set; }

    }

}