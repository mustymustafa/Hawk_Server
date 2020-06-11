if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
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
import JobController from './controllers/JobController';


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
//certificate
app.post('/api/v1/cert', upload.single('image'), ArtisanController.uploadCert);
//set images
app.post('/api/v1/setid', ArtisanController.setId);
app.post('/api/v1/setdp', ArtisanController.setDp);
app.post('/api/v1/setcert', ArtisanController.setCert);


//vehicle papers start

app.post('/api/v1/vl', upload.single('image'), ArtisanController.uploadVl);
app.post('/api/v1/insurance', upload.single('image'), ArtisanController.uploadIns);
app.post('/api/v1/poo', upload.single('image'), ArtisanController.uploadPoo);
app.post('/api/v1/vir', upload.single('image'), ArtisanController.uploadVir);
app.post('/api/v1/vpic', upload.single('image'), ArtisanController.uploadVpic);

//set vehicle papers
app.post('/api/v1/setvl', ArtisanController.setVl);
app.post('/api/v1/setinsurance', ArtisanController.setIns);
app.post('/api/v1/setpoo', ArtisanController.setPoo);
app.post('/api/v1/setvir', ArtisanController.setVir);
app.post('/api/v1/setvpic', ArtisanController.setVpic);

//end


//set id card expiry
app.post('/api/v1/idexpiry', ArtisanController.idExpiry);

//set vehicle details
app.post('/api/v1/vehicledetails', ArtisanController.vehicleDetails);





app.get('/api/v1/user/:uid', UserController.userDetails);

//get drivers

app.get('/api/v1/drivers', ArtisanController.getDrivers);

//push notification
app.post('/api/v1/token/:uid', UserController.savePushToken);

app.post('/api/v1/jobrequest', JobController.createJob);
app.post('/api/v1/driverrequest', JobController.driverRequest);




//Artisan controller
app.post('/api/v1/signup-artisan', Middleware.signupMiddleware, ArtisanController.signup);
app.post('/api/v1/continue-signup-artisan', ArtisanController.continueSignup);

app.post('/api/v1/signin-artisan', Middleware.signinMiddleware, ArtisanController.signin);
app.post('/api/v1/:uid/update',  ArtisanController.updateArtisan);

app.post('/api/v1/confirmation-artisan', ArtisanController.confirm);
app.post('/api/v1/send-otp', ArtisanController.sendOtp);
app.post('/api/v1/forgot-password-artisan', ArtisanController.forgotPassword);
app.post('/api/v1/change-password-artisan', ArtisanController.changePassword);
app.get('/api/v1/artisan/:uid', ArtisanController.userDetails);

app.post('/api/v1/artisan/:uid/loc', ArtisanController.artisanLoc);

app.post('/api/v1/location/:uid', ArtisanController.storeLocation);
app.post('/api/v1/movinglocation/:uid', ArtisanController.updateLocation);

//push notification
app.post('/api/v1/aToken/:uid', ArtisanController.savePushToken);


//jobs 
app.post('/api/v1/jobs', JobController.displayJobs);
app.post('/api/v1/job/:job_id/accept', JobController.acceptJob);
app.post('/api/v1/job/:job_id/start', JobController.startJob);
app.post('/api/v1/job/:job_id/arrive', JobController.driverArrived);


app.post('/api/v1/job/:job_id/accepttaxi', JobController.acceptTaxi);
app.post('/api/v1/job/:job_id/show', JobController.showJob);



app.post('/api/v1/job/:job_id/cancel', JobController.cancelJob);
app.post('/api/v1/job/:job_id/cancel-artisan', JobController.cancelArtisan);

app.post('/api/v1/job/:job_id/complete', JobController.completeJob);

app.post('/api/v1/:uid/jobs', JobController.artisanJobs);
app.post('/api/v1/:uid/job/artisan', JobController.getArtisan);
app.post('/api/v1/:uid/job/artisan/start', JobController.startedJob);
app.post('/api/v1/job/:uid/lastjob', JobController.checkRating);
app.post('/api/v1/job/:uid/rate', JobController.rateArtisan);










//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running.....")
});


//seedUser();
//seedArtisan();