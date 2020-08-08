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
mongoose_1.default.connect(`mongodb+srv://hawkAdmin:${process.env.DB_PASSWORD}@hawk-gqvoe.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('database connected.....'))
    .catch((error) => console.log(error.toString()));
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
//app.use(express.static(path.join(__dirname, 'public')));
//routes
app.post('/api/v1/signup', Middleware_1.default.signupMiddleware, UserController_1.default.signup);
app.post('/api/v1/signin', Middleware_1.default.signinPhoneMiddleware, UserController_1.default.signin);
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
//set images
app.post('/api/v1/setid', ArtisanController_1.default.setId);
app.post('/api/v1/setdp', ArtisanController_1.default.setDp);
app.post('/api/v1/setcert', ArtisanController_1.default.setCert);
app.post('/api/v1/setschool', ArtisanController_1.default.setSchool);
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
//check for unfinished registration and delete
const task = node_cron_1.default.schedule("00 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("registration deletion after a day");
    //find accounts
    const delete_account = yield schema_1.default.Artisan().deleteMany({ isConfirmed: false });
    console.log("deleted:" + delete_account);
    const now = new Date().toLocaleDateString();
    //deactivate account if expired
    console.log("now" + now);
    const user = yield schema_1.default.Artisan().updateMany({ expireAt: now }, { $set: { active: false } }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Expired users updated');
        }
    });
    console.log(user);
}), { scheduled: true });
// send discount notification
const discount = node_cron_1.default.schedule("00 12 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount notification initialized");
    //find accounts
    const now = new Date().toLocaleDateString();
    const get_users = yield schema_1.default.User().find({ next_promo: now });
    // console.log("deleted:" + get_users)
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "You have 30% off discount today!",
                "body": "Open your Sleek App"
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
const discount1 = node_cron_1.default.schedule("00 00 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("discount notification initialized");
    //find accounts
    const now = new Date().toLocaleDateString();
    const get_users = yield schema_1.default.User().find({ next_promo: now });
    // console.log("deleted:" + get_users)
    get_users.map(users => {
        console.log("tokens:" + users.pushToken);
        let chunks = expo.chunkPushNotifications([{
                "to": [users.pushToken],
                "sound": "default",
                "title": "You have 30% off discount today!",
                "body": "Open your Sleek App"
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
task.start();
discount.start();
discount1.start();
//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("server running.....");
});
