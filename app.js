var express           =require("express"),
	app               =express(),
	methodOverride    =require("method-override"),
	expressSanatizer  =require("express-sanitizer"),
	bodyParser        =require("body-parser"),
	mongoose          =require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog",{
	useNewUrlParser:true, 
	useUnifiedTopology: true,
	useFindAndModify:true
});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanatizer());

var blogSchema=new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type: Date, default:Date.now}
	
});
var Blog=mongoose.model("Blog",blogSchema);



//Index Route
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blog){
		if(err)
			console.log(err);
		else
			res.render("index",{blog:blog});
	})
})
//New Route
app.get("/blogs/new",function(req,res){
	res.render("new");
});
//Create Route
app.post("/blogs",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlogPost){
		if(err)
			res.render("new");
		else
			res.redirect("/blogs");
	});	 
});

//Show Route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.render("show",{blog:foundBlog});
	});
});

//Edit Rout
app.get("/blogs/:id/edit",function(req, res){
	Blog.findById(req.params.id, function(err,blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else
			res.render("edit", {blog: blog});
	});
});

//Update Route
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs/"+req.params.id);
	});
})

//Delete Route
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/blogs");
		else
			res.redirect("/blogs");
	});
})

app.listen(3000, function(){
	console.log("Server is Running");
})
