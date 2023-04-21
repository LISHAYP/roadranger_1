using data;
using NLog;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using WebApplication1.DTO;
using HttpPostAttribute = System.Web.Mvc.HttpPostAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;

namespace WebApplication1.Controllers
{
    public class CountriesController : ApiController
    {
        igroup190_test1Entities db = new igroup190_test1Entities();
        private static Logger logger = LogManager.GetCurrentClassLogger();


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

        [Route("api/getcountries")]
        public IHttpActionResult GetCountryData()
        {
            try
            {
                var result = db.tblCountries
                                            .Select(c => new
                                            {
                                                country_name = c.country_name,
                                                country_number = c.country_number
                                            })
                                            .ToList();

                return Ok(result);
            }
            catch (Exception )
            {

                return BadRequest();
            }
            
        }

        [Route("api/getareaswithcountry")]
        public IHttpActionResult GetAreasData()
        {
            try
            {
                var result = db.tblArea
                           .Select(a => new
                           {
                               area_name = a.area_name,
                               area_number = a.area_number,
                               country_number = a.tblCountries.country_number
                           })
                           .ToList();

                return Ok(result);
            }
            catch (Exception)
            {

                return BadRequest();
            }
           
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
                    logger.Info("new country was added to the database!");

                }
                catch (DbEntityValidationException ex)
                {
                    foreach (var error in ex.EntityValidationErrors)
                    {
                        foreach (var validationError in error.ValidationErrors)
                        {
                            Console.WriteLine("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                            logger.Error(validationError.ErrorMessage);
                        }
                    }
                }

                return Ok(newCountry.country_number);
            }


        }

        // POST: api/Countries/countryarea
        //[HttpPost]
        //[Route("api/post/countryarea")]
        //public IHttpActionResult LookupCountryOrArea([FromBody] CountriesDto lookup)
        //{
        //    if (lookup == null)
        //    {
        //        return BadRequest();
        //    }


        //    var country = db.tblCountries.FirstOrDefault(x => x.country_number == lookup.country_number);
        //    var area = db.tblArea.FirstOrDefault(x => x.area_number == lookup.area_number);

        //    if (country != null )
        //    {
        //        return Ok(country.country_name + " " + area.area_name );
        //    }

        //    return NotFound();
        //}

        [HttpPost]
        [Route("api/post/countryarea")]
        public IHttpActionResult LookupCountryOrArea([FromBody] EventDto lookup)
        {
            try
            {
                if (lookup == null)
                {
                    logger.Error("events not found!");
                    return BadRequest();
                }

                var @event = db.tblEvents.FirstOrDefault(x => x.eventNumber == lookup.eventNumber);

                if (@event == null)
                {
                    logger.Error($"event number: {lookup.eventNumber} was not found!");
                    return NotFound();
                }

                var country = db.tblCountries.FirstOrDefault(a => a.country_number == @event.country_number);
                var area = db.tblArea.FirstOrDefault(b => b.area_number == @event.area_number);

                if (country != null && area != null)
                {
                    return Ok(country.country_name + " " + area.area_name);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                return BadRequest() ;
            }
       
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
