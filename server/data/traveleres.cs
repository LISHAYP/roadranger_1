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
    
    public partial class traveleres
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public traveleres()
        {
            this.tblAskForHelp = new HashSet<tblAskForHelp>();
            this.tblComments = new HashSet<tblComments>();
            this.tblConversationTravelers = new HashSet<tblConversationTravelers>();
            this.tblConversationTravelers1 = new HashSet<tblConversationTravelers>();
            this.tblConversationTravelerStack = new HashSet<tblConversationTravelerStack>();
            this.tblEvents = new HashSet<tblEvents>();
            this.tblLocations = new HashSet<tblLocations>();
            this.stakeholders = new HashSet<stakeholders>();
        }
    
        public int traveler_id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string travler_email { get; set; }
        public Nullable<int> phone { get; set; }
        public Nullable<bool> notifications { get; set; }
        public string insurence_company { get; set; }
        public Nullable<bool> location { get; set; }
        public Nullable<bool> save_location { get; set; }
        public System.DateTime dateOfBirth { get; set; }
        public string password { get; set; }
        public Nullable<bool> chat { get; set; }
        public string gender { get; set; }
        public string picture { get; set; }
        public string token { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblAskForHelp> tblAskForHelp { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblComments> tblComments { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblConversationTravelers> tblConversationTravelers { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblConversationTravelers> tblConversationTravelers1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblConversationTravelerStack> tblConversationTravelerStack { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblEvents> tblEvents { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblLocations> tblLocations { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<stakeholders> stakeholders { get; set; }
    }
}
