using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class StackholderDto
    {

        public int StakeholderId { get; set; }
        public string FullName { get; set; }
        public string StakeholderEmail { get; set; }
        public int? Phone { get; set; }
        public bool? Notifications { get; set; }
        public bool? Chat { get; set; }
        public string StakeholderName { get; set; }
        public bool? Approved { get; set; }
        public DateTime ApprovelDate { get; set; }
        public string StakeholderType { get; set; }
        public string Password { get; set; }
    }
}