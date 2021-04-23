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
const request_1 = __importDefault(require("request"));
const node_cron_1 = __importDefault(require("node-cron"));
const schema_1 = __importDefault(require("./schema/schema"));
const Middleware_1 = __importDefault(require("./middleware/Middleware"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const ArtisanController_1 = __importDefault(require("./controllers/ArtisanController"));
const util_1 = require("./util");
const JobController_1 = __importDefault(require("./controllers/JobController"));
const expo_server_sdk_1 = require("expo-server-sdk");
const PaymentController_1 = __importDefault(require("./controllers/PaymentController"));
const AdminContoller_1 = __importDefault(require("./controllers/AdminContoller"));
const expo = new expo_server_sdk_1.Expo();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);
//database 
mongoose_1.default.connect(`mongodb+srv://hawkAdmin:${process.env.DB_PASSWORD}@hawk-gqvoe.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('database connected.....'))
    .catch((error) => console.log(error.toString()));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
//app.use(express.static(path.join(__dirname, 'public')));
//routes
app.post('/api/v1/signup', Middleware_1.default.userSignupMiddleware, UserController_1.default.signup);
app.post('/api/v1/signin', Middleware_1.default.signinPhoneMiddleware, UserController_1.default.signin);
app.post('/api/v1/adminsignin', Middleware_1.default.signinMiddleware, ArtisanController_1.default.adminSignin);
//subaccount
app.post('/api/v1/subaccount', ArtisanController_1.default.Subsignup);
app.post('/api/v1/:uid/getSubs', ArtisanController_1.default.Subs);
app.post('/api/v1/:uid/subAccounts', ArtisanController_1.default.allAccounts);
app.post('/api/v1/:uid/deleteSub', ArtisanController_1.default.deleteSub);
app.post('/api/v1/:rid/delegate', JobController_1.default.delegateLog);
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
//get drivers and logs
app.get('/api/v1/drivers', ArtisanController_1.default.getDrivers);
app.get('/api/v1/logs', ArtisanController_1.default.getLog);
//push notification
app.post('/api/v1/token/:uid', UserController_1.default.savePushToken);
//app.post('/api/v1/jobrequest', JobController.createJob);
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
app.post('/api/v1/:uid/job/track', JobController_1.default.trackReq);
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
app.get('/api/v1/statistics', AdminContoller_1.default.statistics);
//send notification
app.post('/api/v1/user/notification', AdminContoller_1.default.userNotification);
app.post('/api/v1/driver/notification', AdminContoller_1.default.driverNotification);
//send single notification
app.post('/api/v1/user/snotification', AdminContoller_1.default.singleNot);
app.post('/api/v1/driver/snotification', AdminContoller_1.default.singleNotD);
//send text
app.post('/api/v1/:uid/user/text', AdminContoller_1.default.userText);
app.post('/api/v1/:uid/driver/text', AdminContoller_1.default.driverText);
//****************************** */
////////PLATABOX WALLET ROUTES///////
app.post('/api/v1/:uid/fund', UserController_1.default.fundWallet);
app.post('/api/v1/:uid/withdraw', UserController_1.default.withdrawFund);
app.post('/api/v1/:uid/transferRequest', UserController_1.default.transferRequests);
app.post('/api/v1/:uid/updateTransfer', UserController_1.default.updateTransfer);
app.post('/api/v1/:uid/getTrans', UserController_1.default.allTrans);
app.get('/api/v1/getTransactions', UserController_1.default.getTrans);
//PLATABOX DRIVER WALLET
app.post('/api/v1/:uid/driverwithdraw', ArtisanController_1.default.withdrawFund);
app.post('/api/v1/:uid/drivertransferRequest', ArtisanController_1.default.transferRequests);
app.post('/api/v1/:uid/driverupdateTransfer', ArtisanController_1.default.updateTransfer);
app.post('/api/v1/:uid/drivergetTrans', ArtisanController_1.default.allTrans);
//PLATABOX WALLET VERIFICATION
app.post('/api/v1/verifyAccount', PaymentController_1.default.verifyAccount);
///emergency 
app.post('/api/v1/:uid/emergency/contact', UserController_1.default.emergencyContact);
app.post('/api/v1/:uid/emergency', UserController_1.default.Emergency);
//testing route
app.get('/test', (request, response) => {
    response.send('working');
});
app.post('/testpost', (request, response) => {
    response.send('working');
});
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
    //deactivate s
    //find the user's first 
    const user = yield schema_1.default.Artisan().find({ name: 'Platabox Test' /**expireAt: today, earnings: {$gt: 2000}*/ });
    console.log(user);
    if (user) {
        yield schema_1.default.Artisan().updateMany({ name: 'Platabox Test' /**expireAt: today, earnings: {$gt: 2000}*/ }, { $set: { active: false } }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Expired accounts updated');
                //send notification for expiry
                user.map(usr => {
                    //check if accounts have subaccouts
                    const sub = schema_1.default.Artisan().find({ owner: usr._id });
                    console.log(sub);
                    if (sub) {
                        schema_1.default.Artisan().updateMany({ owner: usr._id }, { $set: { active: false } }, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Expired sub accounts updated');
                            }
                        });
                    }
                    console.log("tokens:" + usr.pushToken);
                    let chunks = expo.chunkPushNotifications([{
                            "to": [usr.pushToken],
                            "sound": "default",
                            "title": "Account on hold",
                            "body": "Please pay your 15% weekly commission today to activate your account(s) :)"
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
        //check if user has sub accounts
    }
}), { scheduled: true });
//change everyone's discount date
const users = () => __awaiter(void 0, void 0, void 0, function* () {
    yield schema_1.default.User().updateMany({ isConfirmed: true, pushToken: { $exists: true } }, { $set: {
            promo: false,
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
//users();
//general drivers update
const drivers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield schema_1.default.Artisan().updateMany({ isConfirmed: true }, { $set: {
            total_funds: 0
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Added');
        }
    });
});
//drivers()
//gen notification
const genNot = () => __awaiter(void 0, void 0, void 0, function* () {
    const get_users = yield schema_1.default.User().find({ pushToken: { $exists: true } });
    console.log("users:" + get_users);
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "Fuel Scarcity",
                "body": "You might experience a slight delay in pick-up time because of fuel scarcity. Please bear with us :)"
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
});
//genNot()
//driver update
const genNotD = () => __awaiter(void 0, void 0, void 0, function* () {
    const get_users = yield schema_1.default.Artisan().find({ pushToken: { $exists: true } });
    console.log("users:" + get_users);
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "New Location Update",
                "body": "Please update your platabox app from your Apple Playstore or Google App Store! :)"
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
});
//genNotD()
const setBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("balance initialized");
    //find accountsfree 
    const get_users = yield schema_1.default.User().find({ isConfirmed: true, pushToken: { $exists: true } });
    console.log("users:" + get_users);
    if (get_users) {
        yield schema_1.default.User().updateMany({ isConfirmed: true, pushToken: { $exists: true } }, { $set: {
                balance: 0,
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('Added balance');
            }
        });
    }
});
//setBalance();
const deleteJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield schema_1.default.Job().find({ user: '6020683d04d67000178d683a' });
    console.log(jobs);
    yield schema_1.default.Job().deleteMany({
        user: '6020683d04d67000178d683a'
    });
});
//deleteJobs()
//deleteU.start();
deactivate.start();
//verify account
const verifyA = () => __awaiter(void 0, void 0, void 0, function* () {
    var options = {
        'method': 'POST',
        'url': 'https://api.flutterwave.com/v3/accounts/resolve',
        'headers': {
            'Authorization': `Bearer ${process.env.SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            "account_number": "0695945271",
            "account_bank": "044"
        })
    };
    request_1.default(options, (error, resp) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.log(error);
        }
        ;
        console.log(resp.body.split(":")[1].split(",")[0].trim());
        if (resp.body.split(":")[1].split(",")[0].trim() === '"error"') {
            console.log("Invalid Account Details. Please check and try again");
        }
        else {
            const m = resp.body.split(":")[5].split(",")[0].replace('}}', "");
            console.log(m);
        }
    }));
});
//verifyA();
const getBanks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            "country": "NG" //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
        };
        const response = yield flw.Bank.country(payload);
        console.log(response);
    }
    catch (error) {
        console.log(error);
    }
});
//getBanks();
const transfer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            "account_bank": "043",
            "account_number": "0695945271",
            "amount": 100,
            "narration": `Platabox Wallet Withdrawal of 200`,
            "currency": "NGN",
            "reference": "pbwd-" + Date.now()
        };
        const response = yield flw.Transfer.initiate(payload);
        console.log(response);
        if (response.data.status === 'FAILED') {
            console.log('transaction failed. Please try again later');
        }
        if (response.data.status === 'NEW') {
            console.log('Transaction Successful');
        }
        if (response.data.fullname === 'N/A') {
            console.log('Invalid account number');
        }
    }
    catch (error) {
        console.log(error);
    }
});
//transfer();
const getBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    var options = {
        'method': 'GET',
        'url': 'https://api.flutterwave.com/v3/balances/NGN',
        'headers': {
            'Authorization': `Bearer ${process.env.SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    request_1.default(options, function (error, response) {
        if (error) {
            console.log(error);
        }
        ;
        return (response.body.split(":")[5].split(",")[0]);
    });
});
//getBalance();
//test requests
const req = () => __awaiter(void 0, void 0, void 0, function* () {
    const category = 'log';
    const city = 'Abuja';
    const city2 = 'Abuja Municipal Area Council';
    const job = yield schema_1.default.Artisan().find({ category: 'log', pushToken: { $exists: true }, $or: [{ city: city === undefined ? '' : city.trim() }, { city: city2 === undefined ? '' : city2.trim() }, { city2: city === undefined ? '' : city.trim() }, { city2: city2 === undefined ? '' : city2.trim() }] });
    console.log('Drivers' + job);
});
//req()
//send single notification
const sinNot = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield schema_1.default.User().findOne({ pushToken: { $exists: true }, phone: '+2348032900274' });
    console.log("users:" + user);
    console.log("tokens:" + user);
    let chunks = expo.chunkPushNotifications([{
            "to": user.pushToken,
            "sound": "default",
            "title": "Credit Alert",
            "body": "you have been given N2000 in your platabox wallet. Enjoy! :)"
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
//sinNot()
//seedArtisan();
//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("server running on ....." + port);
});
