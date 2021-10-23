using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auth.Models
{
    public class AppUser : IdentityUser
    {

        public string DisplayName { get; set; }
        public string Description { get; set; }
        public int Age { get; set; }

    }
}
