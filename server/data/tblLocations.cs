//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace data
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblLocations
    {
        public int locationNumber { get; set; }
        public int travelerId { get; set; }
        public System.DateTime dateAndTime { get; set; }
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
    
        public virtual traveleres traveleres { get; set; }
    }
}
