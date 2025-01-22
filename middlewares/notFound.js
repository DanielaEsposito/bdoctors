function notFound ( req, res, next){
    res.status(404);
    res.json({
        status: "KO",
        error : errorHandler.message
    })
}
module.exports = notFound;