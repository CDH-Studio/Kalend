let express = require("express");
let router = express.Router();

router.get("/", function(req, res, next){
	res.render("index.html")
}); 

router.get("/api/test", function(req, res, next){
	let data = {test: "This is test data"};
	res.send(data);
});

module.exports = router;