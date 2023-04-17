using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class LocationDto
    {
        public int TravelerId { get; set; }
        public DateTime DateAndTime { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public int LocationNumber {get; set;}
    }
}