if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
import express, { Request, Response }from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import cron from 'node-cron';

import seedUser, {seedArtisan} from './schema/seed';

import Schema from './schema/schema';

import Middleware from './middleware/Middleware';
import UserController from './controllers/UserController'
import ArtisanController from './controllers/ArtisanController'
import {upload} from './util'
import JobController from './controllers/JobController';

import { Expo } from "expo-server-sdk";
const expo = new Expo();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);



//database 
 mongoose.connect(
    `mongodb+srv://hawkAdmin:${process.env.DB_PASSWORD}@hawk-gqvoe.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true},
).then(() =>   console.log('database connected.....'))
.catch((error) => console.log(error.toString()));

 
const app = express();










app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//routes

app.post('/api/v1/signup', Middleware.userSignupMiddleware, UserController.signup);
app.post('/api/v1/signin', Middleware.signinPhoneMiddleware, UserController.signin);
app.post('/api/v1/adminsignin', Middleware.signinMiddleware, ArtisanController.adminSignin);



app.post('/api/v1/confirmation', UserController.confirm);
app.post('/api/v1/resend-otp', UserController.resendOtp);
app.post('/api/v1/forgot-password', UserController.forgotPassword);
app.post('/api/v1/change-password', UserController.changePassword);

app.post('/api/v1/:uid/history', JobController.getHistory);


app.post('/api/v1/image', upload.single('image'), ArtisanController.uploadimage);
app.post('/api/v1/dp', upload.single('image'), ArtisanController.uploadDp);
//certificate
app.post('/api/v1/cert', upload.single('image'), ArtisanController.uploadCert);
app.post('/api/v1/school', upload.single('image'), ArtisanController.uploadSchool);
app.post('/api/v1/cac', upload.single('image'), ArtisanController.uploadCac);

//set images
app.post('/api/v1/setid', ArtisanController.setId);
app.post('/api/v1/setdp', ArtisanController.setDp);
app.post('/api/v1/setcert', ArtisanController.setCert);
app.post('/api/v1/setschool', ArtisanController.setSchool);
app.post('/api/v1/setcac', ArtisanController.setCac);


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
app.post('/api/v1/logrequest', JobController.logRequest);





//Artisan controller
app.post('/api/v1/signup-artisan', Middleware.signupMiddleware, ArtisanController.signup);
app.post('/api/v1/continue-signup-artisan', ArtisanController.continueSignup);

app.post('/api/v1/signin-artisan', Middleware.signinPhoneMiddleware, ArtisanController.signin);
app.post('/api/v1/:uid/update',  ArtisanController.updateArtisan);

app.post('/api/v1/confirmation-artisan', ArtisanController.confirm);
app.post('/api/v1/send-otp', ArtisanController.sendOtp);

app.post('/api/v1/resend-otp', UserController.resendOtp);
//app.post('/api/v1/resend-otp', UserController.resendOtp);



app.post('/api/v1/forgot-password-artisan', ArtisanController.forgotPassword);
app.post('/api/v1/change-password-artisan', ArtisanController.changePassword);
app.get('/api/v1/artisan/:uid', ArtisanController.userDetails);
app.post('/api/v1/artisan/:uid/activate', ArtisanController.activateAccount);


app.post('/api/v1/artisan/:uid/loc', ArtisanController.artisanLoc);

app.post('/api/v1/location/:uid', ArtisanController.storeLocation);
app.post('/api/v1/movinglocation/:uid', ArtisanController.updateLocation);

//push notification
app.post('/api/v1/aToken/:uid', ArtisanController.savePushToken);


//jobs 
app.post('/api/v1/jobs', JobController.displayJobs);
app.post('/api/v1/logjobs', JobController.logRequests);

app.post('/api/v1/job/:job_id/accept', JobController.acceptJob);
app.post('/api/v1/job/:job_id/start', JobController.startJob);
app.post('/api/v1/job/:job_id/arrive', JobController.driverArrived);


app.post('/api/v1/job/:job_id/accepttaxi', JobController.acceptTaxi);
app.post('/api/v1/job/:job_id/acceptlog', JobController.acceptLog);
app.post('/api/v1/job/:job_id/show', JobController.showJob);



app.post('/api/v1/job/:job_id/cancel', JobController.cancelJob);
app.post('/api/v1/job/:job_id/delete', JobController.deleteJob);

app.post('/api/v1/job/:job_id/cancel-artisan', JobController.cancelArtisan);

app.post('/api/v1/job/:job_id/complete', JobController.completeJob);

app.post('/api/v1/:uid/jobs', JobController.artisanJobs);
app.post('/api/v1/:uid/job/artisan', JobController.getArtisan);
app.post('/api/v1/:uid/job/artisan/start', JobController.startedJob);
app.post('/api/v1/job/:uid/lastjob', JobController.checkRating);
app.post('/api/v1/job/:uid/rate', JobController.rateArtisan);



//ADMIN API
app.get('/api/v1/driverregistration', ArtisanController.getDriverRegistartion);
app.get('/api/v1/logregistration', ArtisanController.getLogRegistartion);
app.get('/api/v1/getdrivers', ArtisanController.getDrivers);
app.get('/api/v1/getlogs', ArtisanController.getLog);
app.get('/api/v1/getusers', UserController.Users);
app.get('/api/v1/getdeliveires', JobController.Deliveries);
app.get('/api/v1/getrides', JobController.Rides);

app.post('/api/v1/:uid/activate', ArtisanController.adminActivate);

app.post('/api/v1/:uid/deactivate', ArtisanController.deactivateAccount);



////////PLATABOX WALLET ROUTES///////
app.post('/api/v1/:uid/fund', UserController.fundWallet);
app.post('/api/v1/:uid/withdraw', UserController.withdrawFund);
app.post('/api/v1/:uid/transferRequest', UserController.transferRequests);
app.post('/api/v1/:uid/updateTransfer', UserController.updateTransfer);
app.post('/api/v1/:uid/getTrans', UserController.getTrans);
app.get('/api/v1/getTransactions', UserController.allTrans);





//testing route
app.get('/test', (request:Request, response:Response) => {
  response.send('working')
})

app.post('/testpost', (request:Request, response:Response) => {
  response.send('working')
})








const now = new Date();
const next = new Date();
const tom = new Date();
next.setDate(next.getDate() + 7)
tom.setDate(next.getDate() + 1)


const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year



const nmonth = next.getMonth() + 1
const nday = next.getDate()
const nyear = next.getFullYear()
const next_promo = nmonth + '/' + nday + '/' + nyear


const tomorrow = month + '/' + (day+1) + '/' + year



console.log("today" + today)
console.log("tomorrow " + tomorrow)
console.log("next promo " + next_promo)





//unfinished registration
const deleteU = cron.schedule("00 23 * * *", async () => {
  console.log("registration deletion after a day");
//find accounts


  const delete_account = await Schema.Artisan().deleteMany({isConfirmed: false})
  console.log("deleted:" + delete_account)

  const delete_user = await Schema.User().deleteMany({isConfirmed: false})
  console.log("deleted:" + delete_user)
  
},

{scheduled: true}
);




//deactivate expired accounts
const deactivate = cron.schedule("00 00 * * *", async () => {
  console.log("account paused for payment");
//find accounts

//standard date
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const nextday = now.getDate() + 1
const year = now.getFullYear()
const today = month + '/' + day + '/' + year
const next_promo = month + '/' + nextday + '/' + year
console.log("today: " + today);
console.log("next promo: " + next_promo)

//deactivate account if expired


//find the user's first 
const user = await Schema.Artisan().find({expireAt: today, earnings: {$gt: 1500}});
console.log(user)
if(user){
  await Schema.Artisan().updateMany({expireAt: today, earnings: {$gt: 1500}},  
    {$set: {active: false}},
    function(err, result){ 
    if(err) {
      console.log(err)
    } else {
      console.log('Expired users updated');

      //send notification for expiry
      user.map(usr => {
        console.log("tokens:" + usr.pushToken)
        let chunks = expo.chunkPushNotifications([{
          "to": [usr.pushToken],
          "sound": "default",
          "title": "Account on hold",
          "body": "Please pay your 40% weeklu commission today to activate your account :)"
        }]);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
           
            } catch (error) {
              console.error(error);
            }
          }
        })();
    
      })
      
    }
  }
    );

    
 
}




  
},

{scheduled: true}
);




/**
 * const notificationA = cron.schedule("08 15 * * *", async () => {
  
  console.log(" notification initialized");
//find accounts


  const get_users = await Schema.User().find({pushToken: {$exists: true} })
 console.log("users:" + get_users)

  get_users.map(users => {
 
    console.log("tokens:" + users.pushToken)
    let chunks = expo.chunkPushNotifications([{
      "to": [users.pushToken],
      "sound": "default",
      "title": "Resumption!",
      "body": "We just want to let you know that we have fully resumed operations and ready to take your orders. we are also giving 30% discount to all our lovely customers :)"
    }]);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
       
        } catch (error) {
          console.error(error);
        }
      }
    })();
    })
  
},

{scheduled: true}
);
 */




//********DISCOUNT*******************

//2. check if today is not discount then disable
const discountCheck = cron.schedule("00 00 * * *", async () => {
  
  console.log("discount check initialized");
//find accounts
//standard date
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year


  const get_users = await Schema.User().find({next_promo: { $ne: today }, pushToken: {$exists: true} })
 console.log("users:" + get_users)

 if(get_users){

  await Schema.User().updateMany({next_promo: { $ne: today }, pushToken: {$exists: true}},  
    {$set: {
      promo: false
    }
  
  },
    function(err, result){ 
    if(err) {
      console.log(err)
    } else {
      console.log('updated discounts');
    }
    })
  }
 
},

{scheduled: true}
);


//2. check if today is discount then enable 
const discountCheck1 = cron.schedule("00 10 * * *", async () => {
  
  console.log("discount check initialized");
//find accounts

//standard date
const now = new Date();
const next = new Date();
next.setDate(next.getDate() + 7)

const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year

const nmonth = next.getMonth() + 1
const nday = next.getDate()
const nyear = next.getFullYear()
const next_promo = nmonth + '/' + nday + '/' + nyear
//

 const get_users = await Schema.User().find({next_promo: today, pushToken: {$exists: true} })
 console.log("users:" + get_users)

 if(get_users){

  await Schema.User().updateMany({next_promo: today, pushToken: {$exists: true}},  
    {$set: {
      promo: true,
             promo_date: today,
             next_promo: next_promo
    }
  
  },
    function(err, result){ 
    if(err) {
      console.log(err)
    } else {
      console.log('updated discounts');
    }
    })
  }
 
},

{scheduled: true}
);
















// send discount notification
const discount = cron.schedule("10 00 * * *", async () => {
  
  console.log("discount notification initialized");
//find accounts
//standard date
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const nextday = now.getDate() + 1
const year = now.getFullYear()
const today = month + '/' + day + '/' + year
const next_promo = month + '/' + nextday + '/' + year
console.log("today: " + today);
console.log("next promo: " + next_promo)

  const get_users = await Schema.User().find({promo: true, pushToken: {$exists: true} })
 console.log("users:" + get_users)

  get_users.map(users => {
 
    console.log("tokens:" + users.pushToken)
    let chunks = expo.chunkPushNotifications([{
      "to": [users.pushToken],
      "sound": "default",
      "title": "Don't forget to use your 30% discount today :)",
      "body": "Open your Platabox App"
    }]);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
       
        } catch (error) {
          console.error(error);
        }
      }
    })();
    })
  
},

{scheduled: true}
);

const discount1 = cron.schedule("13 00 * * *", async () => {
  
  console.log("discount notification initialized");
//find accounts//standard date
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const nextday = now.getDate() + 1
const year = now.getFullYear()
const today = month + '/' + day + '/' + year
const next_promo = month + '/' + nextday + '/' + year
console.log("today: " + today);
console.log("next promo: " + next_promo)

const get_users = await Schema.User().find({promo: true, pushToken: {$exists: true} })
  console.log("users:" + get_users)

  get_users.map(users => {
 
    console.log("tokens:" + users.pushToken)
    let chunks = expo.chunkPushNotifications([{
      "to": [users.pushToken],
      "sound": "default",
      "title": "Enjoy your 30% discount today!",
      "body": "Open your Platabox App"
    }]);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
       
        } catch (error) {
          console.error(error);
        }
      }
    })();
    })
  
},

{scheduled: true}
);





//FREE DISCOUNT**

/** 
 const freeDiscount = cron.schedule("20 23 * * *", async () => {
  
  console.log("discount notification initialized");
//find accountsfree 

//standard date
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year
const next_promo = "10/30/2020"
//

  const get_users = await Schema.User().find({isConfirmed: true, pushToken: {$exists: true}})
 console.log("users:" + get_users)

 if(get_users){

  await Schema.User().updateMany({isConfirmed: true, pushToken: {$exists: true}},  
    {$set: {
      promo: true,
             promo_date: today,
             next_promo: next_promo
    }
  
  },
    function(err, result){ 
    if(err) {
      console.log(err)
    } else {
      console.log('Added free discounts');

      //send notification for expiry
      get_users.map(usr => {
        console.log("tokens:" + usr.pushToken)
        let chunks = expo.chunkPushNotifications([{
          "to": [usr.pushToken],
          "sound": "default",
          "title": "Free 30% Discount!!",
          "body": "you have been awarded a free 30% discount :)"
        }]);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
           
            } catch (error) {
              console.error(error);
            }
          }
        })();
    
      })
    }
    })
  }
 
  
},

{scheduled: true}
);
**/
 
















//change everyone's discount date

const users = async ()  => {
  await Schema.User().updateMany({isConfirmed: true, pushToken: {$exists: true}},  
    {$set: {
      promo: true,
             promo_date: today,
             next_promo: tomorrow
    }
  
  },
    function(err, result){ 
    if(err) {
      console.log(err)
    } else {
      console.log('Added free discounts');
}
    })
}
//users();






const notificationB = cron.schedule("28 20 * * *", async () => {
  
  console.log(" notification initialized");
//find accounts


  const get_users = await Schema.Artisan().find({pushToken: {$exists: true} })
  console.log("users:" + get_users)

  get_users.map(users => {
 
    console.log("tokens:" + users.pushToken)
    let chunks = expo.chunkPushNotifications([{
      "to": [users.pushToken],
      "sound": "default",
      "title": "New Update!",
      "body": "Hello! Please update your app from your app store : )"
    }]);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
       
        } catch (error) {
          console.error(error);
        }
      }
    })();
    })
  
},

{scheduled: true}
);



//gen notification

const genNot = async () => {
  
  const get_users = await Schema.User().find({pushToken: {$exists: true} })
  console.log("users:" + get_users)

  get_users.map(users => {
 
    console.log("tokens:" + users.pushToken)
    let chunks = expo.chunkPushNotifications([{
      "to": [users.pushToken],
      "sound": "default",
      "title": "Christmas Break",
      "body": "Dear lovely customers, we want to inform you that we will be closed from the 25th of December till the 3rd of January. Have a wonderful Christmas and a Happy New Year! :)"
    }]);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
       
        } catch (error) {
          console.error(error);
        }
      }
    })();
    })
  
  }


//genNot()

deleteU.start();
//freeDiscount.start();
discountCheck.start()
discountCheck1.start()
//deactivate.start();
discount.start();
discount1.start();

//notificationA.start()
//notificationB.start()





const getBanks = async () => {

  try {
      const payload = {
          
          "country":"NG" //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
          
      }
      const response = await flw.Bank.country(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}


//getBanks();


const transfer = async () => {
  try {
      const payload = {
          "account_bank": "043",
          "account_number": "0695945271",
          "amount": 100,
          "narration": `Platabox Wallet Withdrawal of 200`,
          "currency": "NGN",
          "reference":"pbwd-"+ Date.now()
      }
      const response = await flw.Transfer.initiate(payload)
      console.log(response)
      if(response.data.status === 'FAILED'){
        console.log('transaction failed. Please try again later')
      }

      if(response.data.status === 'NEW'){
        console.log('Transaction Successful')
      }

      if(response.data.fullname === 'N/A'){
        console.log('Invalid account number')
      }

  } catch (error) {
      console.log(error)
  }
}
transfer();







//seedArtisan();

//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running on ....." + port)
});


