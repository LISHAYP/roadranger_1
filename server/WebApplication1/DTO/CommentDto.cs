using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.DTO
{
    public class CommentDto
    {
        public int CommentNumber { get; set; }
        public int EventNumber { get; set; }
        public string Details { get; set; }
        public DateTime CommentDate { get; set; }
        public TimeSpan CommentTime { get; set; }
        public int? TravelerId { get; set; }
        public int? StackholderId { get; set; }
        public string TravelerName { get; set; }
        public string StakeholderName { get; set; }
    }
}