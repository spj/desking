﻿using System.Web;
using System.Web.Optimization;

namespace desking
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            //// Use the development version of Modernizr to develop with and learn from. Then, when you're
            //// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //          "~/Scripts/bootstrap.js",
            //          "~/Scripts/respond.js"));

            //bundles.Add(new StyleBundle("~/Content/css").Include(
            //          "~/Content/bootstrap.css",
            //          "~/Content/site.css"));
            bundles.Add(new ScriptBundle("~/bundles/desking").Include("~/Scripts/common/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/desking.account").Include(
      "~/Scripts/bz.account.js"));
            bundles.Add(new ScriptBundle("~/bundles/desking.register").Include(
     "~/Scripts/bz.register.js"));
            bundles.Add(new ScriptBundle("~/bundles/desking.usersAdmin").Include(
"~/Scripts/bz.usersAdmin.js"));
            bundles.Add(new ScriptBundle("~/bundles/desking.forgetPwd").Include(
      "~/Scripts/bz.forgetPwd.js"));
            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/css/common/*.css"));
            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
           // BundleTable.EnableOptimizations = true;
        }
    }
}
