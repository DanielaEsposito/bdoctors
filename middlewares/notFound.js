function notFound ( req, res, next){
    res.status(404);
    res.json({
        status: "KO",
        error : "404"
    })
}
module.exports = notFound;