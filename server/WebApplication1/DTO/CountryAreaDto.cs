﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using data;

namespace WebApplication1.DTO
{
    public class CountryAreaDto
    {
        public int country_number { get; set; }
        public int area_number { get; set; }
        public string area_name { get; set; }
        public string city { get; set; }
    }
}