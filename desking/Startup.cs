using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(desking.Startup))]
namespace desking
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
