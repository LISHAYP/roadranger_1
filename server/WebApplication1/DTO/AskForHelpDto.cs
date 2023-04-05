using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class AskForHelpDto
    {
        public string Details { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Picture { get; set; }
        public int Traveler_id { get; set; }
        public int Stakeholder_id { get; set; }
        public int SerialTypeNumber { get; set; }
        public int CountryNumber { get; set; }
        public int AreaNumber { get; set; }
      
    }
    public class ShowAskForHelpDto
    {
        public string Details { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Picture { get; set; }
       

    }
}