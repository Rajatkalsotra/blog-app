var express=require("express"),
router	   =express.Router();
var Blog   	   =require("../models/blog"),
middleware 	   =require("../middleware/index");

// INDEX ROUTE
router.get("/blogs",function(req,res){
	Blog.find({},function(err,all){
		if(err){
			req.flash("error",err.message);
		}
		else{
			res.render("blogs/blogs",{blogs:all});
		}
	})
});
// NEW ROUTE
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
})
// SHOW ROUTE
router.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,blog){
		if(err){
			req.flash("error",err.message);		
		}
		else{
			res.render("blogs/show",{blog:blog});
		}
	})
});
// CREATE ROUTE
router.post("/blogs",middleware.isLoggedIn,function(req,res){
	var author={
		username:req.user.username,
		id:req.user._id
	}
	var ob=req.body.blog;
	ob.author=author;
	Blog.create(req.body.blog,function(err,blog){
		
		if(err){
			req.flash("error",err.message);
			res.render("blogs");
		}
		else{
			req.flash("success","Successfully created Blog!!");				
			res.redirect("/blogs");
		}
	})	
});
// EDIT ROUTE
router.get("/blogs/:id/edit",middleware.blogOwner,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			
			req.flash("error",err.message);
			res.redirect("/grounds/:id");
		}
		else{
			res.render("blogs/edit",{blog,blog});

		}
	});
});
// UPDATE ROUTE
router.put("/blogs/:id",middleware.blogOwner,function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
		if(err){
			req.flash("error",err.message);
			res.redirect("blogs"+req.params.id);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})
// DELETE ROUTE
router.delete("/blogs/:id",middleware.blogOwner,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			req.flash("success","Successfully removed blog");
			res.redirect("/blogs");
		}		
	})
})

module.exports=router;