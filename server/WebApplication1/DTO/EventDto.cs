using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class EventDto
    {
        public int eventNumber { get; set; }
        public string Details { get; set; }
        public DateTime EventDate { get; set; }
        public TimeSpan EventTime { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public Nullable<bool> EventStatus { get; set; }
        public string Picture { get; set; }
        public Nullable<int> TravelerId { get; set; }
        public Nullable<int> StackholderId { get; set; }
        public int SerialTypeNumber { get; set; }
        public int CountryNumber { get; set; }
        public int AreaNumber { get; set; }
        public string labels { get; set; }
        public Nullable<int> is_related { get; set; }

    }
}