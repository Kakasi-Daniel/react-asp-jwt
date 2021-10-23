using auth.DTOs;
using auth.Models;
using auth.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> LogInUser([FromBody] LoginDto loginInfo)
        {
            var user = await userManager.FindByEmailAsync(loginInfo.Email);

            if (user == null) return NotFound();

            var res = await signInManager.CheckPasswordSignInAsync(user, loginInfo.Password, false);

            if (res.Succeeded)
            {
                return 

                    new UserDto
                    {
                        DisplayName = user.DisplayName,
                        Image = null,
                        Token= tokenService.CreateToken(user),
                        Username = user.UserName
                    };
            }

            return Unauthorized();
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody]RegisterDto registrationInfo)
        {
            if(await userManager.Users.AnyAsync(x => x.Email == registrationInfo.Email))
            {
                return BadRequest("Email taken.");
            }

            if(await userManager.Users.AnyAsync(x => x.UserName == registrationInfo.Username))
            {
                return BadRequest("Username taken.");
            }

            var dates = registrationInfo.BornDate.Split("-");

            var dateBornInfo = new DateTime(int.Parse(dates[0]),int.Parse(dates[1]),int.Parse(dates[2]));

            var finalAge = (int)Math.Floor((DateTime.Now - dateBornInfo).TotalDays/365);

            var user = new AppUser
            {
                DisplayName = registrationInfo.DisplayName,
                Email = registrationInfo.Email,
                UserName = registrationInfo.Username,
                Age = finalAge
            };

            var res = await userManager.CreateAsync(user, registrationInfo.Password);

            if (res.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = tokenService.CreateToken(user),
                    Username = user.UserName
                };
            }

            return BadRequest(res.Errors);

        }
        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = tokenService.CreateToken(user),
                    Username = user.UserName
                };
            }
            catch (Exception err)
            {
                return Ok(err.ToString());
            }

           
        }

    }
}
