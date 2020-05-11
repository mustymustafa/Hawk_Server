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
const Schema_1 = __importDefault(require("../schema/Schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'musty.mohammed1998@gmail.com',
        pass: process.env.PASS
    }
});
class JobController {
    static createJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, uid, location, description, area1, area2 } = request.body;
            console.log(category, uid, location, description);
            console.log("area1:" + area1);
            console.log("area2:" + area2);
            let savedTokens;
            try {
                if (!description) {
                    console.log("no desc");
                    return response.status(409).send({
                        message: 'Please enter a description',
                    });
                }
                if (!location) {
                    console.log("no loc");
                    return response.status(409).send({
                        message: 'Please enter a location',
                    });
                }
                //find user{}
                //                 const user = await Schema.User().findById({_id: uid})
                //               .populate({path: 'user', model: Schema.Job() }).exec()
                // console.log(user);
                //create job
                const dt = new Date();
                const now = dt.setMinutes(dt.getMinutes());
                const createdAt = dt.toLocaleDateString();
                const endAt = dt.setMinutes(dt.getMinutes() + 30);
                console.log(createdAt);
                console.log("end:" + endAt);
                console.log("now:" + now);
                yield Schema_1.default.Job().create({
                    user: uid,
                    category: category,
                    location: location,
                    description: description,
                    status: 'active',
                    rated: false,
                    area1: area1,
                    area2: area2,
                    createdAt: createdAt,
                    endAt: endAt,
                    now: now,
                    active: true
                });
                response.status(201).send({
                    message: 'Job created successfully',
                    status: 201
                });
                const artisan = yield Schema_1.default.Artisan().find({ category: category });
                const artis = artisan.map(art => {
                    return art.pushToken;
                });
                savedTokens = artis;
                console.log(artis);
                if (!artisan) {
                    return response.status(404).send({
                        message: 'No artisans found'
                    });
                }
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "title": "Job Request",
                        "body": `A ${category} is needed.`
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
            }
            catch (error) {
                console.log(error.toString());
                response.status(500).send({
                    message: "Somenthing went wrong"
                });
            }
        });
    }
    static displayJobs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, area1, area2 } = request.body;
            console.log(category);
            console.log("area1:" + area1);
            console.log("area2:" + area2);
            // find artisan
            const job = yield Schema_1.default.Job().find({ category: category, $or: [{ area1: area1 }, { area2: area2 }], $and: [{ status: 'active' }] });
            console.log(job);
            return response.status(200).send({ job });
        });
    }
    static acceptJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id, price } = request.body;
            console.log("uid" + uid, "job_id" + job_id);
            let savedTokens;
            const job = yield Schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield Schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield Schema_1.default.Artisan().findOne({ _id: uid });
            console.log(price);
            console.log("wage " + artisan.wage);
            if (!price || price > artisan.wage) {
                return response.status(404).send({
                    message: `Please enter a price between (₦)0-${artisan.wage}`
                });
            }
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield Schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        artisan: uid,
                        status: 'accepted',
                        price: price
                    }
                });
                response.status(200).send({ hirer: hirer.name, number: hirer.phone });
                // send notification
                savedTokens = hirer.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "title": "Request Accepted!",
                        "body": `A/an ${job.category} has accepted your request.`
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
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("an error occured");
            }
        });
    }
    static cancelJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id } = request.body;
            console.log("job_id" + job_id);
            let savedTokens = [];
            const job = yield Schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield Schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield Schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log("artisan:" + artisan);
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield Schema_1.default.Job().deleteOne({ _id: job_id });
                console.log("deleted");
                response.status(201).send({
                    message: 'Task Cancelled successfully',
                    status: 201
                });
                savedTokens.push(hirer.pushToken);
                savedTokens.push(artisan.pushToken);
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "title": "Job Canceled!",
                        "body": 'Your Job was canceled.'
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
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("an error occured");
            }
        });
    }
    static completeJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let savedTokens = [];
            const { job_id, } = request.body;
            console.log("job_id" + job_id);
            const job = yield Schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield Schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield Schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log("artisan:" + artisan);
            if (!job) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield Schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        status: 'completed'
                    }
                });
                yield Schema_1.default.Artisan().updateOne({
                    _id: artisan._id
                }, {
                    $inc: {
                        completed: 1
                    }
                });
                response.status(201).send({
                    message: "Completed",
                    status: 201
                });
                savedTokens.push(hirer.pushToken);
                savedTokens.push(artisan.pushToken);
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "title": "Job Completed!",
                        "body": 'Yay! your Job is done.'
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
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("an error occured");
            }
        });
    }
    static artisanJobs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            console.log("artisan:" + uid);
            // find artisan and hirer
            try {
                const job = yield Schema_1.default.Job().find({ artisan: uid, $and: [{ status: 'accepted' }] });
                console.log(job);
                //get hirer id
                const user = job.map(usr => {
                    return usr.user;
                });
                const hirer = yield Schema_1.default.User().findOne({ _id: user });
                console.log("hirer:" + hirer);
                return response.status(200).send({
                    job: job,
                    hirer: hirer
                });
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("An error occured");
            }
        });
    }
    //get artisan
    static getArtisan(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var total = 0;
            const { uid, name } = request.body;
            let savedTokens;
            console.log("category" + name);
            console.log("user:" + uid);
            const user = yield Schema_1.default.User().findOne({ _id: uid });
            // find artisan
            const job = yield Schema_1.default.Job().findOne({ user: uid, $and: [{ category: name }] }).where('status').equals('accepted');
            console.log(job);
            const findArtisan = yield Schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log(findArtisan);
            if (!findArtisan) {
                console.log("No Artisan Available");
                return response.status(400).send({ notFound: "No Artisan is available at the moment" });
            }
            try {
                const getRating = findArtisan.rating;
                console.log(getRating.length);
                for (var i = 0; i < getRating.length; i++) {
                    total += getRating[i];
                }
                var rate = Math.round(total / getRating.length);
                console.log("rating:" + rate);
                response.status(200).send({ artisan: findArtisan, job: job, rating: rate });
                // send notification
                savedTokens = user.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "title": "Artisan Found!",
                        "body": `Yay! We have found your nearest ${job.category}`
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
            }
            catch (error) {
                console.log(error);
                response.status(404).send("something went wrong");
            }
        });
    }
    // Job Rating
    static checkRating(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            console.log("user:" + uid);
            const job = yield Schema_1.default.Job().findOne({ user: uid }).where('rated').equals(false).where('status').equals('completed');
            console.log(job);
            if (job) {
                const artisan = yield Schema_1.default.Artisan().findOne({ _id: job.artisan });
                if (artisan) {
                    try {
                        return response.status(201).send({
                            job: job,
                            artisan: artisan
                        });
                    }
                    catch (error) {
                        console.log(error);
                        return response.status(400).send({
                            message: "error"
                        });
                    }
                }
                else {
                    return response.status(400).send({
                        message: "No Artisan to rate"
                    });
                }
            }
            else {
                return response.status(400).send({
                    message: "No Job to rate"
                });
            }
        });
    }
    static rateArtisan(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, rate, comment } = request.body;
            console.log("user:" + uid);
            let savedTokens;
            if (!rate || rate < 0 || rate > 10) {
                return response.status(409).send({
                    message: 'Please enter a valid number between 0-10',
                });
            }
            const job = yield Schema_1.default.Job().findOne({ user: uid }).where('rated').equals(false).where('status').equals('completed');
            const artisan = yield Schema_1.default.Artisan().findOne({ _id: job.artisan });
            if (job && artisan) {
                console.log("job:" + job._id);
                yield Schema_1.default.Artisan().updateOne({
                    _id: artisan._id
                }, {
                    $push: {
                        rating: rate,
                        comments: comment
                    }
                });
                try {
                    yield Schema_1.default.Job().updateOne({
                        _id: job._id
                    }, {
                        $set: {
                            rated: "true"
                        }
                    });
                    response.status(201).send({
                        message: "Artisan rated"
                    });
                    //send notification
                    savedTokens = artisan.pushToken;
                    let chunks = expo.chunkPushNotifications([{
                            "to": savedTokens,
                            "sound": "default",
                            "title": "New Rating",
                            "body": 'You just got rated for your last job.'
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
                }
                catch (error) {
                    console.log(error);
                    return response.status(400).send({
                        message: "error"
                    });
                }
            }
        });
    }
}
exports.default = JobController;
