"use strict";
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
const Middleware_1 = __importDefault(require("./middleware/Middleware"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const ArtisanController_1 = __importDefault(require("./controllers/ArtisanController"));
const util_1 = require("./util");
const JobController_1 = __importDefault(require("./controllers/JobController"));
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
app.post('/api/v1/signup', Middleware_1.default.signupMiddleware, UserController_1.default.signup);
app.post('/api/v1/signin', Middleware_1.default.signinMiddleware, UserController_1.default.signin);
app.post('/api/v1/confirmation', UserController_1.default.confirm);
app.post('/api/v1/resend-otp', UserController_1.default.resendOtp);
app.post('/api/v1/forgot-password', UserController_1.default.forgotPassword);
app.post('/api/v1/change-password', UserController_1.default.changePassword);
app.post('/api/v1/image', util_1.upload.single('image'), ArtisanController_1.default.uploadimage);
app.post('/api/v1/dp', util_1.upload.single('image'), ArtisanController_1.default.uploadDp);
app.post('/api/v1/setid', ArtisanController_1.default.setId);
app.post('/api/v1/setdp', ArtisanController_1.default.setDp);
app.get('/api/v1/user/:uid', UserController_1.default.userDetails);
//push notification
app.post('/api/v1/token/:uid', UserController_1.default.savePushToken);
app.post('/api/v1/jobrequest', JobController_1.default.createJob);
//Artisan controller
app.post('/api/v1/signup-artisan', Middleware_1.default.signupMiddleware, ArtisanController_1.default.signup);
app.post('/api/v1/continue-signup-artisan', ArtisanController_1.default.continueSignup);
app.post('/api/v1/signin-artisan', Middleware_1.default.signinMiddleware, ArtisanController_1.default.signin);
app.post('/api/v1/confirmation-artisan', ArtisanController_1.default.confirm);
app.post('/api/v1/send-otp', ArtisanController_1.default.sendOtp);
app.post('/api/v1/forgot-password-artisan', ArtisanController_1.default.forgotPassword);
app.post('/api/v1/change-password-artisan', ArtisanController_1.default.changePassword);
app.get('/api/v1/artisan/:uid', ArtisanController_1.default.userDetails);
app.post('/api/v1/location/:uid', ArtisanController_1.default.storeLocation);
//push notification
app.post('/api/v1/aToken/:uid', ArtisanController_1.default.savePushToken);
//jobs 
app.post('/api/v1/jobs', JobController_1.default.displayJobs);
app.post('/api/v1/job/:job_id/accept', JobController_1.default.acceptJob);
app.post('/api/v1/job/:job_id/cancel', JobController_1.default.cancelJob);
app.post('/api/v1/job/:job_id/complete', JobController_1.default.completeJob);
app.post('/api/v1/:uid/jobs', JobController_1.default.artisanJobs);
app.post('/api/v1/:uid/job/artisan', JobController_1.default.getArtisan);
app.post('/api/v1/job/:uid/lastjob', JobController_1.default.checkRating);
app.post('/api/v1/job/:uid/rate', JobController_1.default.rateArtisan);
//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;
app.set('port', port);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("server running.....");
});
//seedUser();
//seedArtisan();
