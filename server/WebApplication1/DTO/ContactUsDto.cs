using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class ContactUsDto
    {

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? PhoneNumber { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Time { get; set; }
        public string RequestType { get; set; }
        public string Details { get; set; }


    }
}