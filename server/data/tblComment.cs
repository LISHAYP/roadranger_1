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
    
    public partial class tblComment
    {
        public int commentNumber { get; set; }
        public int eventNumber { get; set; }
        public string details { get; set; }
        public System.DateTime comment_date { get; set; }
        public System.TimeSpan comment_time { get; set; }
        public Nullable<int> travelerId { get; set; }
        public Nullable<int> stackholderId { get; set; }
    
        public virtual stakeholder stakeholder { get; set; }
        public virtual tblEvent tblEvent { get; set; }
        public virtual travelere travelere { get; set; }
    }
}
