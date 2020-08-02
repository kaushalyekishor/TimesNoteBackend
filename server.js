var express=require('express');
var bodyParser=require('body-parser');
var dotenv=require('dotenv');
dotenv.config();

const port=process.env.PORT;
var app=express();

const database=require('./config/database.config');
var userRoute=require('./app/routes/user.route')
const noteRoute=require('./app/routes/note.route')
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/user',userRoute);
app.use('/note',noteRoute);

database.mongoose;
app.listen(port, () => {
    console.log("server is listening on port ", port);
});