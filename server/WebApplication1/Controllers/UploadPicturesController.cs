using Grpc.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Web.Services;


namespace WebApplication1.Controllers
{
    public class UploadPicturesController : ApiController
    {
        // GET: api/UploadPictures
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/UploadPictures/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/UploadPictures
        public void Post([FromBody] string value)
        {
        }

        [WebMethod]
        public string ImgUpload(string base64img, string base64imgName)
        {
            //for example - pay attention the first '/' is part of the image!
            //
            //File.AppendAllText(Server.MapPath("images/file1.txt"), base64imgName + "\r\n");

            File.WriteAllBytes(HttpContext.Current.Server.MapPath("images/" + base64imgName), Convert.FromBase64String(base64img));
            return new JavaScriptSerializer().Serialize(new { res = "OK" });
        }

        [Route("uploadpicture")]
        public Task<HttpResponseMessage> Post()
        {
            string outputForNir = "start---";
            List<string> savedFilePath = new List<string>();
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            string rootPath = HttpContext.Current.Server.MapPath("~/uploadFiles");
            var provider = new MultipartFileStreamProvider(rootPath);
            var task = Request.Content.ReadAsMultipartAsync(provider).
            ContinueWith<HttpResponseMessage>(t =>
            {
                if (t.IsCanceled || t.IsFaulted)
                {
                    Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                }
                foreach (MultipartFileData item in provider.FileData)
                {
                    try
                    {
                        outputForNir += " ---here";
                        string name = item.Headers.ContentDisposition.FileName.Replace("\"", "");
                        outputForNir += " ---here2=" + name;
                        //need the guid because in react native in order to refresh an inamge it has to have a new name
                        string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + Guid.NewGuid() + Path.GetExtension(name);
                        //string newFileName = name + "" + Guid.NewGuid();
                        outputForNir += " ---here3" + newFileName;
                        //delete all files begining with the same name
                        string[] names = Directory.GetFiles(rootPath);
                        foreach (var fileName in names)
                        {
                            if (Path.GetFileNameWithoutExtension(fileName).IndexOf(Path.GetFileNameWithoutExtension(name)) != -
                1)
                            {
                                File.Delete(fileName);
                            }
                        }
                        //File.Move(item.LocalFileName, Path.Combine(rootPath, newFileName));
                        File.Copy(item.LocalFileName, Path.Combine(rootPath, newFileName), true);
                        File.Delete(item.LocalFileName);
                        outputForNir += " ---here4";
                        Uri baseuri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, string.Empty));
                        outputForNir += " ---here5";
                        string fileRelativePath = "~/uploadFiles/" + newFileName;
                        outputForNir += " ---here6 imageName=" + fileRelativePath;
                        Uri fileFullPath = new Uri(baseuri, VirtualPathUtility.ToAbsolute(fileRelativePath));
                        outputForNir += " ---here7" + fileFullPath.ToString();
                        savedFilePath.Add(fileFullPath.ToString());
                    }
                    catch (Exception ex)
                    {
                        outputForNir += " ---excption=" + ex.Message;
                        string message = ex.Message;
                    }
                }
                return Request.CreateResponse(HttpStatusCode.Created, "nirchen " + savedFilePath[0] + "!" + provider.FileData.Count + "!" + outputForNir + ":)");
            });
            return task;
        }


        // PUT: api/UploadPictures/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/UploadPictures/5
        public void Delete(int id)
        {
        }
    }
}
