var express        	 =require("express"),
app       			 =express(),
bodyParser 			 =require("body-parser"),
mongoose   			 =require("mongoose"),
passport		  	 =require("passport"),
passportLocal		 =require("passport-local"),
methodOverride		 =require("method-override"),
Blog 				 =require("./models/blog"),
Comment 			 =require("./models/comment"),
User 				 =require("./models/user"),
flash 				 =require("connect-flash");

// ROUTES
var blogRoutes  =require("./routes/blogs"),
indexRoutes		=require("./routes/index"),
commentRoutes	=require("./routes/comments");

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret:"Jai hind",
	resave:false,
	saveUniniatialized:false
}));
// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Access current user from each template 
app.use(function(req,res,next){
	res.locals.user=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

// ROUTES
app.use(indexRoutes);
app.use(commentRoutes);
app.use(blogRoutes);

app.listen(process.env.PORT,function(){
	console.log("SERVER STARTED!!!");
});