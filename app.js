// config enviroment variables

require ("dotenv").config();
const cors = require("cors")
// EXPRESS

const express=require("express");
const app = express();
//IMPORT .ENV

const {APP_HOST, APP_PORT, FRONTEND_URL}= process.env;

//MIDDLEWARE REGISTRATION

app.use(express.json());
app.use(express.static("public"));
const errorHandler = require("./middlewares/errorsHandler.js");
const notFound = require("./middlewares/notFound.js");
app.use(cors({
    origin: FRONTEND_URL
}))
//ROUTERS

const Router = require("./routes/routes");
app.use("/", Router);

// ERROR HENDLER

app.use(errorHandler);
app.use(notFound);

//SERVER LISTENING
app.listen(APP_PORT,()=>{
    console.log(`Server listening at ${APP_HOST}:${APP_PORT}`);
    
});