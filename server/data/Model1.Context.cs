﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class igroup190_test1Entities : DbContext
    {
        public igroup190_test1Entities()
            : base("name=igroup190_test1Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<stakeholders> stakeholders { get; set; }
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<tblApi> tblApi { get; set; }
        public virtual DbSet<tblArea> tblArea { get; set; }
        public virtual DbSet<tblAskForHelp> tblAskForHelp { get; set; }
        public virtual DbSet<tblComments> tblComments { get; set; }
        public virtual DbSet<tblContactUs> tblContactUs { get; set; }
        public virtual DbSet<tblConversationTravelers> tblConversationTravelers { get; set; }
        public virtual DbSet<tblConversationTravelerStack> tblConversationTravelerStack { get; set; }
        public virtual DbSet<tblCountries> tblCountries { get; set; }
        public virtual DbSet<tblEvents> tblEvents { get; set; }
        public virtual DbSet<tblLocations> tblLocations { get; set; }
        public virtual DbSet<tblType> tblType { get; set; }
        public virtual DbSet<traveleres> traveleres { get; set; }
    }
}
