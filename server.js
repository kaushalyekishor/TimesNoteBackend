var express=require('express');
var bodyParser=require('body-parser');
var dotenv=require('dotenv');
dotenv.config();

const port=process.env.PORT;
var app=express();

const database=require('./config/database.config');
var userRoute=require('./app/routes/user.route')
const noteRoute=require('./app/routes/note.route')
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/user',userRoute);
app.use('/note',noteRoute);

database.mongoose;
app.listen(port, () => {
    console.log("server is listening on port ", port);
});