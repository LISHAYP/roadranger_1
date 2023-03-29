using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class AskForHelpDto
    {
        public int RequestNumber { get; set; }
        public string Details { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Picture { get; set; }
        public int UserId { get; set; }
        public int SerialTypeNumber { get; set; }
        public int CountryNumber { get; set; }
        public int AreaNumber { get; set; }
        public string TypeName { get; set; }
        public string CountryName { get; set; }
        public string AreaName { get; set; }
    }
}