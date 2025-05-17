using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AlertSystem.Models
{
	public class LoginModel
	{
        [Required(ErrorMessage = "The  UserName is required.")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "The  Password is required.")]
        public string Password { get; set; }
    }
}