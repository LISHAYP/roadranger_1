
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
    
public partial class tblAskForHelp
{

    public int requastNumber { get; set; }

    public string details { get; set; }

    public decimal latitude { get; set; }

    public decimal longitude { get; set; }

    public string picture { get; set; }

    public int traveler_id { get; set; }

    public int serialTypeNumber { get; set; }

    public int country_number { get; set; }

    public int area_number { get; set; }

    public Nullable<int> stakeholder_id { get; set; }



    public virtual stakeholders stakeholders { get; set; }

    public virtual tblArea tblArea { get; set; }

    public virtual traveleres traveleres { get; set; }

    public virtual tblType tblType { get; set; }

}

}
