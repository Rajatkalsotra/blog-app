var express=require("express"),
router	   =express.Router();
var passport=require("passport");
var User=require("../models/user");

// HOME
router.get("/",function(req,res){
	res.render("home");
});
// ME
router.get("/me",function(req,res){
	res.render("me");
})
// AUTH ROUTES
// REGISTER FORM
router.get("/register",function(req,res){
	res.render("register");
});
// REGISTER USER
router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/blogs");
			})
		}
	})
});
// LOGIN USER
router.get("/login",function(req,res){
	res.render("login");
})
// LOGGING IN
router.post("/login",passport.authenticate(
	"local",{
			successRedirect:"/blogs",
			failureRedirect:"/login"
			}
	),function(req,res){});

// LOGOUT ROUTE
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!!")
	res.redirect("/blogs");
});

module.exports=router;