var blog=require("../models/blog"),
Comment   =require("../models/comment");
var middlewareOb={};
	middlewareOb.blogOwner = function(req,res,next){
		if(req.isAuthenticated()){
			blog.findById(req.params.id,function(err,blog){
				if(err){
					console.log(err);
					res.redirect("/blogs/:id");
				}
				else{
					if(blog.author.id.equals(req.user._id)){
						next();
					}
					else{	
					 req.flash("error","Access denied!!");
					 res.redirect("back");
					 }
				}
			})
		}
		else{
					res.redirect("back");
		}	
	}

	middlewareOb.commentOwner = function(req,res,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.commentId,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else{
					if(comment.author.id.equals(req.user._id)){
						next();
					}
					else{		
					 req.flash("error","Access denied!!");		
					 res.redirect("back");
					 }
				}
			})
		}
		else{
					res.redirect("back");
		}	
	}                                                                                                                                                     

	middlewareOb.isLoggedIn = function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error","You need to login first!!");
		res.redirect("/login");
	}

module.exports=middlewareOb;