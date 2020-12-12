"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
const schema_1 = __importDefault(require("./schema/schema"));
const Middleware_1 = __importDefault(require("./middleware/Middleware"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const ArtisanController_1 = __importDefault(require("./controllers/ArtisanController"));
const util_1 = require("./util");
const JobController_1 = __importDefault(require("./controllers/JobController"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
//database 
mongoose_1.default.connect(`mongodb+srv://hawkAdmin:${process.env.DB_PASSWORD}@hawk-gqvoe.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('database connected.....'))
    .catch((error) => console.log(error.toString()));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
//app.use(express.static(path.join(__dirname, 'public')));
//routes
app.post('/api/v1/signup', Middleware_1.default.userSignupMiddleware, UserController_1.default.signup);
app.post('/api/v1/signin', Middleware_1.default.signinPhoneMiddleware, UserController_1.default.signin);
app.post('/api/v1/adminsignin', Middleware_1.default.signinMiddleware, ArtisanController_1.default.adminSignin);
app.post('/api/v1/confirmation', UserController_1.default.confirm);
app.post('/api/v1/resend-otp', UserController_1.default.resendOtp);
app.post('/api/v1/forgot-password', UserController_1.default.forgotPassword);
app.post('/api/v1/change-password', UserController_1.default.changePassword);
app.post('/api/v1/:uid/history', JobController_1.default.getHistory);
app.post('/api/v1/image', util_1.upload.single('image'), ArtisanController_1.default.uploadimage);
app.post('/api/v1/dp', util_1.upload.single('image'), ArtisanController_1.default.uploadDp);
//certificate
app.post('/api/v1/cert', util_1.upload.single('image'), ArtisanController_1.default.uploadCert);
app.post('/api/v1/school', util_1.upload.single('image'), ArtisanController_1.default.uploadSchool);
app.post('/api/v1/cac', util_1.upload.single('image'), ArtisanController_1.default.uploadCac);
//set images
app.post('/api/v1/setid', ArtisanController_1.default.setId);
app.post('/api/v1/setdp', ArtisanController_1.default.setDp);
app.post('/api/v1/setcert', ArtisanController_1.default.setCert);
app.post('/api/v1/setschool', ArtisanController_1.default.setSchool);
app.post('/api/v1/setcac', ArtisanController_1.default.setCac);
//vehicle papers start
app.post('/api/v1/vl', util_1.upload.single('image'), ArtisanController_1.default.uploadVl);
app.post('/api/v1/insurance', util_1.upload.single('image'), ArtisanController_1.default.uploadIns);
app.post('/api/v1/poo', util_1.upload.single('image'), ArtisanController_1.default.uploadPoo);
app.post('/api/v1/vir', util_1.upload.single('image'), ArtisanController_1.default.uploadVir);
app.post('/api/v1/vpic', util_1.upload.single('image'), ArtisanController_1.default.uploadVpic);
//set vehicle papers
app.post('/api/v1/setvl', ArtisanController_1.default.setVl);
app.post('/api/v1/setinsurance', ArtisanController_1.default.setIns);
app.post('/api/v1/setpoo', ArtisanController_1.default.setPoo);
app.post('/api/v1/setvir', ArtisanController_1.default.setVir);
app.post('/api/v1/setvpic', ArtisanController_1.default.setVpic);
//end
//set id card expiry
app.post('/api/v1/idexpiry', ArtisanController_1.default.idExpiry);
//set vehicle details
app.post('/api/v1/vehicledetails', ArtisanController_1.default.vehicleDetails);
app.get('/api/v1/user/:uid', UserController_1.default.userDetails);
//get drivers
app.get('/api/v1/drivers', ArtisanController_1.default.getDrivers);
//push notification
app.post('/api/v1/token/:uid', UserController_1.default.savePushToken);
app.post('/api/v1/jobrequest', JobController_1.default.createJob);
app.post('/api/v1/driverrequest', JobController_1.default.driverRequest);
app.post('/api/v1/logrequest', JobController_1.default.logRequest);
//Artisan controller
app.post('/api/v1/signup-artisan', Middleware_1.default.signupMiddleware, ArtisanController_1.default.signup);
app.post('/api/v1/continue-signup-artisan', ArtisanController_1.default.continueSignup);
app.post('/api/v1/signin-artisan', Middleware_1.default.signinPhoneMiddleware, ArtisanController_1.default.signin);
app.post('/api/v1/:uid/update', ArtisanController_1.default.updateArtisan);
app.post('/api/v1/confirmation-artisan', ArtisanController_1.default.confirm);
app.post('/api/v1/send-otp', ArtisanController_1.default.sendOtp);
app.post('/api/v1/resend-otp', UserController_1.default.resendOtp);
//app.post('/api/v1/resend-otp', UserController.resendOtp);
app.post('/api/v1/forgot-password-artisan', ArtisanController_1.default.forgotPassword);
app.post('/api/v1/change-password-artisan', ArtisanController_1.default.changePassword);
app.get('/api/v1/artisan/:uid', ArtisanController_1.default.userDetails);
app.post('/api/v1/artisan/:uid/activate', ArtisanController_1.default.activateAccount);
app.post('/api/v1/artisan/:uid/loc', ArtisanController_1.default.artisanLoc);
app.post('/api/v1/location/:uid', ArtisanController_1.default.storeLocation);
app.post('/api/v1/movinglocation/:uid', ArtisanController_1.default.updateLocation);
//push notification
app.post('/api/v1/aToken/:uid', ArtisanController_1.default.savePushToken);
//jobs 
app.post('/api/v1/jobs', JobController_1.default.displayJobs);
app.post('/api/v1/logjobs', JobController_1.default.logRequests);
app.post('/api/v1/job/:job_id/accept', JobController_1.default.acceptJob);
app.post('/api/v1/job/:job_id/start', JobController_1.default.startJob);
app.post('/api/v1/job/:job_id/arrive', JobController_1.default.driverArrived);
app.post('/api/v1/job/:job_id/accepttaxi', JobController_1.default.acceptTaxi);
app.post('/api/v1/job/:job_id/acceptlog', JobController_1.default.acceptLog);
app.post('/api/v1/job/:job_id/show', JobController_1.default.showJob);
app.post('/api/v1/job/:job_id/cancel', JobController_1.default.cancelJob);
app.post('/api/v1/job/:job_id/delete', JobController_1.default.deleteJob);
app.post('/api/v1/job/:job_id/cancel-artisan', JobController_1.default.cancelArtisan);
app.post('/api/v1/job/:job_id/complete', JobController_1.default.completeJob);
app.post('/api/v1/:uid/jobs', JobController_1.default.artisanJobs);
app.post('/api/v1/:uid/job/artisan', JobController_1.default.getArtisan);
app.post('/api/v1/:uid/job/artisan/start', JobController_1.default.startedJob);
app.post('/api/v1/job/:uid/lastjob', JobController_1.default.checkRating);
app.post('/api/v1/job/:uid/rate', JobController_1.default.rateArtisan);
//ADMIN API
app.get('/api/v1/driverregistration', ArtisanController_1.default.getDriverRegistartion);
app.get('/api/v1/logregistration', ArtisanController_1.default.getLogRegistartion);
app.get('/api/v1/getdrivers', ArtisanController_1.default.getDrivers);
app.get('/api/v1/getlogs', ArtisanController_1.default.getLog);
app.get('/api/v1/getusers', UserController_1.default.Users);
app.get('/api/v1/getdeliveires', JobController_1.default.Deliveries);
app.get('/api/v1/getrides', JobController_1.default.Rides);
app.post('/api/v1/:uid/activate', ArtisanController_1.default.adminActivate);
app.post('/api/v1/:uid/deactivate', ArtisanController_1.default.deactivateAccount);
////////PLATABOX WALLET ROUTES///////
app.post('api/v1/:uid/fund', UserController_1.default.fundWallet);
const now = new Date();
const next = new Date();
const tom = new Date();
next.setDate(next.getDate() + 7);
tom.setDate(next.getDate() + 1);
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + '/' + day + '/' + year;
const nmonth = next.getMonth() + 1;
const nday = next.getDate();
const nyear = next.getFullYear();
const next_promo = nmonth + '/' + nday + '/' + nyear;
const tomorrow = month + '/' + (day + 1) + '/' + year;
console.log("today" + today);
console.log("tomorrow " + tomorrow);
console.log("next promo " + next_promo);
//unfinished registration
const deleteU = node_cron_1.default.schedule("00 23 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("registration deletion after a day");
    //find accounts
    const delete_account = yield schema_1.default.Artisan().deleteMany({ isConfirmed: false });
    console.log("deleted:" + delete_account);
    const delete_user = yield schema_1.default.User().deleteMany({ isConfirmed: false });
    console.log("deleted:" + delete_user);
}), { scheduled: true });
//deactivate expired accounts
const deactivate = node_cron_1.default.schedule("00 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("account paused for payment");
    //find accounts
    //standard date
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const nextday = now.getDate() + 1;
    const year = now.getFullYear();
    const today = month + '/' + day + '/' + year;
    const next_promo = month + '/' + nextday + '/' + year;
    console.log("today: " + today);
    console.log("next promo: " + next_promo);
    //deactivate account if expired
    //find the user's first 
    const user = yield schema_1.default.Artisan().find({ expireAt: today, earnings: { $gt: 1500 } });
    console.log(user);
    if (user) {
        yield schema_1.default.Artisan().updateMany({ expireAt: today, earnings: { $gt: 1500 } }, { $set: { active: false } }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Expired users updated');
                //send notification for expiry
                user.map(usr => {
                    console.log("tokens:" + usr.pushToken);
                    let chunks = expo.chunkPushNotifications([{
                            "to": [usr.pushToken],
                            "sound": "default",
                            "title": "Account on hold",
                            "body": "Please pay your 40% weeklu commission today to activate your account :)"
                        }]);
                    let tickets = [];
                    (() => __awaiter(this, void 0, void 0, function* () {
                        for (let chunk of chunks) {
                            try {
                                let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                                console.log(ticketChunk);
                                tickets.push(...ticketChunk);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                    }))();
                });
            }
        });
    }
}), { scheduled: true });
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
const discountCheck = node_cron_1.default.schedule("00 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount check initialized");
    //find accounts
    //standard date
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const today = month + '/' + day + '/' + year;
    const get_users = yield schema_1.default.User().find({ next_promo: { $ne: today }, pushToken: { $exists: true } });
    console.log("users:" + get_users);
    if (get_users) {
        yield schema_1.default.User().updateMany({ next_promo: { $ne: today }, pushToken: { $exists: true } }, { $set: {
                promo: false
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('updated discounts');
            }
        });
    }
}), { scheduled: true });
//2. check if today is discount then enable 
const discountCheck1 = node_cron_1.default.schedule("00 10 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount check initialized");
    //find accounts
    //standard date
    const now = new Date();
    const next = new Date();
    next.setDate(next.getDate() + 7);
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const today = month + '/' + day + '/' + year;
    const nmonth = next.getMonth() + 1;
    const nday = next.getDate();
    const nyear = next.getFullYear();
    const next_promo = nmonth + '/' + nday + '/' + nyear;
    //
    const get_users = yield schema_1.default.User().find({ next_promo: today, pushToken: { $exists: true } });
    console.log("users:" + get_users);
    if (get_users) {
        yield schema_1.default.User().updateMany({ next_promo: today, pushToken: { $exists: true } }, { $set: {
                promo: true,
                promo_date: today,
                next_promo: next_promo
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('updated discounts');
            }
        });
    }
}), { scheduled: true });
// send discount notification
const discount = node_cron_1.default.schedule("10 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount notification initialized");
    //find accounts
    //standard date
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const nextday = now.getDate() + 1;
    const year = now.getFullYear();
    const today = month + '/' + day + '/' + year;
    const next_promo = month + '/' + nextday + '/' + year;
    console.log("today: " + today);
    console.log("next promo: " + next_promo);
    const get_users = yield schema_1.default.User().find({ promo: true, pushToken: { $exists: true } });
    console.log("users:" + get_users);
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "Don't forget to use your 30% discount today :)",
                "body": "Open your Platabox App"
            }]);
        let tickets = [];
        (() => __awaiter(void 0, void 0, void 0, function* () {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }))();
    });
}), { scheduled: true });
const discount1 = node_cron_1.default.schedule("13 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount notification initialized");
    //find accounts//standard date
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const nextday = now.getDate() + 1;
    const year = now.getFullYear();
    const today = month + '/' + day + '/' + year;
    const next_promo = month + '/' + nextday + '/' + year;
    console.log("today: " + today);
    console.log("next promo: " + next_promo);
    const get_users = yield schema_1.default.User().find({ promo: true, pushToken: { $exists: true } });
    console.log("users:" + get_users);
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "Enjoy your 30% discount today!",
                "body": "Open your Platabox App"
            }]);
        let tickets = [];
        (() => __awaiter(void 0, void 0, void 0, function* () {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }))();
    });
}), { scheduled: true });
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
const users = () => __awaiter(void 0, void 0, void 0, function* () {
    yield schema_1.default.User().updateMany({ isConfirmed: true, pushToken: { $exists: true } }, { $set: {
            promo: true,
            promo_date: today,
            next_promo: tomorrow
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Added free discounts');
        }
    });
});
users();
const notificationB = node_cron_1.default.schedule("28 20 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(" notification initialized");
    //find accounts
    const get_users = yield schema_1.default.Artisan().find({ pushToken: { $exists: true } });
    console.log("users:" + get_users);
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "New Update!",
                "body": "Hello! Please update your app from your app store : )"
            }]);
        let tickets = [];
        (() => __awaiter(void 0, void 0, void 0, function* () {
            for (let chunk of chunks) {
                try {
                    let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }))();
    });
}), { scheduled: true });
deleteU.start();
//freeDiscount.start();
discountCheck.start();
discountCheck1.start();
//deactivate.start();
discount.start();
discount1.start();
//notificationA.start()
//notificationB.start()
//seedArtisan();
//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("server running.....");
});
