using data;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.DTO;

namespace WebApplication1.Controllers
{
    public class CountriesController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();

        // GET: api/Countries
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Countries/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Countries
        [HttpPost]
        [Route("api/post/country")]
        public IHttpActionResult PostCountry([FromBody] CountriesDto country)
        {

            // Check if the country exists in the database
            var existingcountry = db.tblCountries.FirstOrDefault(x => x.country_name == country.country_name);

            if (existingcountry != null)
            {
                // If the country exists, return its number
                return Ok(existingcountry.country_number);
            }
            else
            {
                // If the country doesn't exist, add it to the database and return its number
                var newCountry = new tblCountries
                {
                    country_name = country.country_name
                };
                db.tblCountries.Add(newCountry);
                try
                {
                    db.SaveChanges();
                }
                catch (DbEntityValidationException ex)
                {
                    foreach (var error in ex.EntityValidationErrors)
                    {
                        foreach (var validationError in error.ValidationErrors)
                        {
                            Console.WriteLine("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                }

                return Ok(newCountry.country_number);
            }


        }

        // POST: api/Countries/countryarea
        [HttpPost]
        [Route("api/post/countryarea")]
        public IHttpActionResult LookupCountryOrArea([FromBody] CountriesDto lookup)
        {
            if (lookup == null)
            {
                return BadRequest();
            }


            var country = db.tblCountries.FirstOrDefault(x => x.country_number == lookup.country_number);
            var area = db.tblArea.FirstOrDefault(x => x.area_number == lookup.area_number);

            if (country != null )
            {
                return Ok(country.country_name + " " + area.area_name );
            }

            return NotFound();
        }


        // PUT: api/Countries/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Countries/5
        public void Delete(int id)
        {
        }
    }
}
