require('dotenv').config();
import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';


import seedUser, {seedArtisan} from './schema/seed';
import Middleware from './middleware/Middleware';
import UserController from './controllers/UserController'
import ArtisanController from './controllers/ArtisanController'
 import {upload} from './util'


//database 
 mongoose.connect(
    `mongodb+srv://hawkAdmin:${process.env.DB_PASSWORD}@hawk-gqvoe.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
).then(() =>   console.log('database connected.....'))
.catch((error) => console.log(error.toString()));

 
const app = express();





app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//routes

app.post('/api/v1/signup', Middleware.signupMiddleware, UserController.signup);
app.post('/api/v1/signin', Middleware.signinMiddleware, UserController.signin);
app.post('/api/v1/confirmation', UserController.confirm);
app.post('/api/v1/resend-otp', UserController.resendOtp);
app.post('/api/v1/forgot-password', UserController.forgotPassword);
app.post('/api/v1/change-password', UserController.changePassword);

app.post('/api/v1/image', upload.single('image'), ArtisanController.uploadimage);
app.post('/api/v1/dp', upload.single('image'), ArtisanController.uploadDp);

app.post('/api/v1/setid', ArtisanController.setId);

//Artisan controller
app.post('/api/v1/signup-artisan', Middleware.signupMiddleware, ArtisanController.signup);
app.post('/api/v1/continue-signup-artisan', ArtisanController.continueSignup);

app.post('/api/v1/signin-artisan', Middleware.signinMiddleware, ArtisanController.signin);
app.post('/api/v1/confirmation-artisan', ArtisanController.confirm);
app.post('/api/v1/resend-otp-artisan', ArtisanController.resendOtp);
app.post('/api/v1/forgot-password-artisan', ArtisanController.forgotPassword);
app.post('/api/v1/change-password-artisan', ArtisanController.changePassword);







//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running.....")
});


//seedUser();
//seedArtisan();