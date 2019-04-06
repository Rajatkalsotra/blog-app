var express=require("express"),
router	   =express.Router();

var Blog 	   =require("../models/blog"),
Comment   	   =require("../models/comment"),
middleware 	   =require("../middleware/index");;

// COMMENTS ROUTES
// NEW
router.get("/blogs/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			req.flash("error",err.message);
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			res.render("comments/new",{blog:blog});
		}
	})
	
});
// CREATE
router.post("/blogs/:id/comments",middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err){
			req.flash("error",err.message);
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("/blogs/"+req.params.id);
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					blog.comments.push(comment._id);
					blog.save();
					req.flash("success","Successfully created the comment!!");
					res.redirect("/blogs/"+req.params.id);
				}
			})
			
		}
	})
});
// EDIT ROUTE
router.get("/blogs/:id/comments/:commentId/edit",middleware.commentOwner,function(req,res){
	Comment.findById(req.params.commentId,function(err,comment){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/"+ req.params.id);
		}
		else{
			res.render("comments/edit",{comment:comment,blogId:req.params.id});	
		}
	})
});
// UPDATE
router.put("/blogs/:id/comments/:commentId",middleware.commentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,comment){
		if(err){
			req.flash("error",err.message);
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});
// DELETE
router.delete("/blogs/:id/comments/:commentId",middleware.commentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.commentId,function(err){
		if(err){
			res.redirect("/blogs/"+req.params.id);
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

module.exports=router;