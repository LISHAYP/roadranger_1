//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DATAa
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblConversationTraveler
    {
        public int ChatId { get; set; }
        public int User_one { get; set; }
        public int User_two { get; set; }
        public byte[] created_at { get; set; }
    
        public virtual travelere travelere { get; set; }
        public virtual travelere travelere1 { get; set; }
    }
}
