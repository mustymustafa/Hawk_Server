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
const schema_1 = __importDefault(require("../schema/schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
//date initialization
const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + '/' + day + '/' + year;
class JobController {
    static driverRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, payment, uid, location, area1, area2, lat, long, destLat, destLong, to, from, time, distance, price, to2, destLat2, destLong2 } = request.body;
            //console.log(category, uid,location)
            //console.log("area1:" + area1);
            //console.log("area2:" + area2);
            //console.log("lat:" + lat);
            //console.log("long:" + long)
            //console.log("destLat:" + destLat);
            //console.log("destLong:" + destLong);
            //console.log("to:" + to);
            //console.log("from:" + from);
            //console.log("time:" + time);
            //console.log("distance:" + distance);
            //console.log("price:" + price);
            let savedTokens;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            try {
                if (payment == 'wallet' && price > user.balance) {
                    console.log("You don't have sufficient balance in your wallet. Please fund your wallet and try again");
                    return response.send({ error: "You don't have sufficient balance in your wallet. Please fund your wallet and try again" });
                }
                //create job
                const dt = new Date();
                // console.log(createdAt)
                //console.log("end:" + endAt)
                //console.log("now:" + now)
                const job = yield schema_1.default.Job().create({
                    user: uid,
                    category: category,
                    location: location,
                    status: 'active',
                    payment: payment,
                    rated: false,
                    area1: area1,
                    area2: area2,
                    to: to,
                    to2: to2,
                    from: from,
                    lat: lat,
                    long: long,
                    destLat: destLat,
                    destLat2: destLat2,
                    destLong: destLong,
                    destLong2: destLong2,
                    time: time,
                    price: price,
                    distance: distance,
                    createdAt: today,
                    active: true
                });
                console.log("job id!!!!" + job.id);
                response.status(201).send({
                    job_id: job.id,
                    message: 'Job created successfully',
                    status: 201
                });
                const artisan = yield schema_1.default.Artisan().find({ category: category, pushToken: { $exists: true } }).where({ area1: area1, $or: [{ area2: area2 }] });
                if (!artisan) {
                    return response.status(404).send({
                        message: 'No driver found'
                    });
                }
                console.log(artisan);
                artisan.map(artis => {
                    console.log(artis.pushToken);
                    //send notification
                    let chunks = expo.chunkPushNotifications([{
                            "to": [artis.pushToken],
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": "Ride Request",
                            "body": "Open your Platabox App"
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
            catch (error) {
                console.log(error.toString());
                response.status(500).send({
                    message: "Somenthing went wrong"
                });
            }
        });
    }
    static logRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { city, city2, payment, category, uid, location, lat, long, destLat, destLat2, destLat3, destLat4, destLat5, destLong, destLong2, destLong3, destLong4, destLong5, to, to2, to3, to4, to5, from, time, distance, price, pTime } = request.body;
            //console.log(category)
            console.log(city);
            let savedTokens;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            try {
                //check if it's a wallet payment
                //verify if user has enough money
                if (payment == 'wallet' && price > user.balance) {
                    console.log("You don't have sufficient balance in your wallet. Please fund your wallet and try again");
                    return response.status(500).send({ error: "You don't have sufficient balance in your wallet. Please fund your wallet and try again" });
                }
                //create job
                const dt = new Date();
                const now = dt.setMinutes(dt.getMinutes());
                const createdAt = dt.toLocaleDateString();
                const endAt = dt.setMinutes(dt.getMinutes() + 30);
                // console.log(pTime)
                //console.log("end:" + endAt)
                //console.log("now:" + now)
                const job = yield schema_1.default.Job().create({
                    user: uid,
                    category: category,
                    location: location,
                    city: city,
                    city2: city2,
                    status: 'active',
                    payment: payment,
                    rated: false,
                    to: to,
                    to2: to2,
                    to3: to3,
                    to4: to4,
                    to5: to5,
                    from: from,
                    pTime: pTime,
                    lat: lat,
                    long: long,
                    destLat: destLat,
                    destLat2: destLat2,
                    destLat3: destLat3,
                    destLat4: destLat4,
                    destLat5: destLat5,
                    destLong: destLong,
                    destLong2: destLong2,
                    destLong3: destLong3,
                    destLong4: destLong4,
                    destLong5: destLong5,
                    time: time,
                    price: price,
                    distance: distance,
                    createdAt: today,
                    endAt: endAt,
                    now: now,
                    active: true
                });
                console.log("job id!!!!" + job.id);
                response.status(201).send({
                    job_id: job.id,
                    message: 'Job created successfully',
                    status: 201
                });
                const artisan = yield schema_1.default.Artisan().find({ category: 'log', pushToken: { $exists: true }, $or: [
                        { city: city },
                        { city2: city2 }
                    ] });
                if (!artisan) {
                    return response.status(404).send({
                        message: 'No riders found'
                    });
                }
                console.log(artisan);
                artisan.map((artis) => {
                    console.log("push tokens:" + artis.pushToken);
                    //send notification
                    let chunks = expo.chunkPushNotifications([{
                            "to": [artis.pushToken],
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": "New Request",
                            "body": "A dispatch Rider is needed!"
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
            catch (error) {
                console.log(error.toString());
                response.status(500).send({
                    message: "Somenthing went wrong"
                });
            }
        });
    }
    //display requests
    static displayJobs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, area1, area2 } = request.body;
            console.log(category);
            console.log("area1:" + area1);
            console.log("area2:" + area2);
            const job = yield schema_1.default.Job().find({ category: category }).where({ area1: area1, $or: [{ area2: area2 }], $and: [{ status: 'active' }] }).sort({ '_id': -1 });
            console.log(job);
            //get hirer id
            const user = job.map(usr => {
                return usr.user;
            });
            const hirer = yield schema_1.default.User().findOne({ _id: user });
            console.log("hirer:" + hirer);
            return response.status(200).send({ job: job, hirer: hirer });
        });
    }
    //display logistics requests
    static logRequests(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, city, city2 } = request.body;
            console.log(category);
            //console.log("area1:" + area1);
            //console.log("area2:" + area2);
            const job = yield schema_1.default.Job().find({ category: category, $or: [
                    { city: city },
                    { city2: city2 }
                ] }).where({ status: 'active' }).sort({ '_id': -1 });
            console.log(job);
            //get hirer id
            const user = job.map(usr => {
                return usr.user;
            });
            const hirer = yield schema_1.default.User().findOne({ _id: user });
            console.log("hirer:" + hirer);
            return response.status(200).send({ job: job, hirer: hirer });
        });
    }
    static acceptJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id, price } = request.body;
            console.log("uid" + uid, "job_id" + job_id);
            let savedTokens;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: uid });
            console.log(price);
            console.log("artisan name " + artisan.name);
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        artisan: uid,
                        artisan_name: artisan.name,
                        status: 'accepted',
                        price: price
                    }
                });
                response.status(200).send({ hirer: hirer.name, number: hirer.phone, job: job });
                // send notification
                savedTokens = hirer.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Request Accepted!",
                        "body": `A driver has accepted your request.`
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
    static acceptTaxi(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id, price } = request.body;
            console.log("uid" + uid, "job_id" + job_id);
            let savedTokens;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: uid });
            console.log(price);
            console.log("artisan " + artisan.name);
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        artisan: uid,
                        status: 'accepted',
                        artisan_name: artisan.name,
                        price: price
                    }
                });
                response.status(200).send({ hirer: hirer.name, number: hirer.phone, job: job });
                // send notification
                savedTokens = hirer.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Request Accepted!",
                        "body": `A Driver has accepted your request and is on his way.`
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
    static acceptLog(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id, price } = request.body;
            console.log("uid" + uid, "job_id" + job_id);
            let savedTokens;
            let total_price;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: uid });
            console.log(price);
            total_price = Math.round(artisan.earnings + parseInt(price));
            console.log("artisan " + artisan.name);
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        artisan: uid,
                        status: 'accepted',
                        artisan_name: artisan.name,
                        price: price
                    }
                });
                yield schema_1.default.Artisan().updateOne({
                    _id: uid
                }, {
                    $set: {
                        earnings: total_price
                    }
                });
                response.status(200).send({ hirer: hirer.name, number: hirer.phone, job: job });
                // send notification
                savedTokens = hirer.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Request Accepted!",
                        "body": `A Dispatcher has accepted your request.`
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
    static showJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id } = request.body;
            console.log("uid" + uid, "job_id" + job_id);
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            //find artisan
            const arti = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log("artisan found:" + arti);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: uid });
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                response.status(200).send({ hirer: hirer.name, number: hirer.phone, job: job, artisan: arti });
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
            let total_price;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log("artisan:" + artisan);
            if (artisan.earnings > 0) {
                total_price = Math.round((artisan.earnings) - job.price);
            }
            else {
                total_price = artisan.earnings;
            }
            /**
             *     const earning = artisan.earnings
         const earnings = earning.splice( earning.indexOf(job.price), 1 );
            */
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": artisan.pushToken,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Request Canceled!",
                        "body": `${hirer.name} canceled his request.`
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
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        status: 'cancelled'
                    }
                });
                yield schema_1.default.Artisan().updateOne({
                    _id: job.artisan
                }, {
                    $set: {
                        earnings: total_price
                    }
                });
                console.log("cancelled");
                response.status(201).send({
                    message: 'Task Cancelled successfully',
                    status: 201
                });
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("an error occured");
            }
        });
    }
    static deleteJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_id } = request.body;
            console.log("job_id" + job_id);
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            if (!job) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield schema_1.default.Job().deleteOne({ _id: job_id });
                console.log("deleted");
                response.status(201).send({
                    message: 'Task Cancelled successfully',
                    status: 201
                });
            }
            catch (error) {
                console.log(error);
                return response.status(404).send("an error occured");
            }
        });
    }
    static cancelArtisan(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, job_id } = request.body;
            console.log("job_id" + job_id);
            let total_price;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: uid });
            console.log("artisan:" + artisan);
            if (artisan.earnings > 0) {
                total_price = Math.round((artisan.earnings) - job.price);
            }
            else {
                total_price = artisan.earnings;
            }
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": hirer.pushToken,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Request Canceled!",
                        "body": `${artisan.name} canceled the Request`
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
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        status: 'cancelled'
                    }
                });
                yield schema_1.default.Artisan().updateOne({
                    _id: job.artisan
                }, {
                    $set: {
                        earnings: total_price
                    }
                });
                console.log("deleted");
                response.status(201).send({
                    message: 'Task Cancelled successfully',
                    status: 201
                });
                console.log(hirer.pushToken);
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
            const { job_id } = request.body;
            console.log("job_id" + job_id);
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            const artisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
            console.log("artisan:" + artisan);
            const completed = Math.round(artisan.completed + 1);
            /**
             *  let earnings;
            if(artisan.category === 'log'){
              earnings = 0;
            } else {
              earnings =  job.price;
            }
             */
            if (!job || !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist or invalid user'
                });
            }
            try {
                yield schema_1.default.Job().updateOne({
                    _id: job_id
                }, {
                    $set: {
                        status: 'completed'
                    }
                });
                yield schema_1.default.Artisan().updateOne({
                    _id: artisan._id
                }, {
                    $set: {
                        start: false,
                        arrived: false,
                        completed: completed
                    }
                });
                const new_balance = hirer.balance - parseInt(job.price);
                console.log(new_balance);
                if (job.payment == 'wallet') {
                    yield schema_1.default.User().updateOne({
                        _id: hirer._id
                    }, {
                        $set: {
                            balance: new_balance
                        }
                    });
                    yield schema_1.default.Transaction().create({
                        user: hirer._id,
                        amount: job.price,
                        status: 'withdraw',
                        date: today
                    });
                }
                response.status(201).send({
                    message: "Completed",
                    status: 201
                });
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": hirer.pushToken,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Ride Completed!",
                        "body": 'Yay! Ride completed'
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
                if (job.payment == 'wallet') {
                    let chunks = expo.chunkPushNotifications([{
                            "to": hirer.pushToken,
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": `Successful Payment :)`,
                            "body": `₦ ${job.price} has been deducted from your wallet for your last request`
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
                const job = yield schema_1.default.Job().find({ artisan: uid }).sort({ '_id': -1 });
                //console.log(job)
                //get hirer id
                const user = job.map(usr => {
                    return usr.user;
                });
                const hirer = yield schema_1.default.User().findOne({ _id: user });
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
            const { uid, name, job_id } = request.body;
            let savedTokens;
            console.log("category" + name);
            console.log("user:" + uid);
            const user = yield schema_1.default.User().findOne({ _id: uid });
            console.log(user);
            // find artisan
            const job = yield schema_1.default.Job().findOne({ _id: job_id, $and: [{ category: name }] }).where('status').equals('accepted');
            console.log('Job A' + job);
            if (job) {
                const findArtisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
                console.log(findArtisan);
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
                            "channelId": "notification-sound-channel",
                            "title": "Yay! Dispatcher Found",
                            "body": `Open your Platabox App`
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
            }
            else {
                console.log("No Driver Available");
                return response.status(404).send("no driver yet");
            }
        });
    }
    // Job Rating
    static checkRating(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            console.log("user:" + uid);
            const job = yield schema_1.default.Job().findOne({ user: uid }).where('rated').equals(false).where('status').equals('completed');
            console.log(job);
            if (job) {
                const artisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
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
            const job = yield schema_1.default.Job().findOne({ user: uid }).where('rated').equals(false).where('status').equals('completed');
            const artisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
            if (job && artisan) {
                console.log("job:" + job._id);
                yield schema_1.default.Artisan().updateOne({
                    _id: artisan._id
                }, {
                    $push: {
                        rating: rate,
                        comments: comment
                    }
                });
                try {
                    yield schema_1.default.Job().updateOne({
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
                            "channelId": "notification-sound-channel",
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
    // start job
    static startJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_id } = request.body;
            let savedTokens;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            console.log("job found:" + job);
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            console.log("hirer:" + hirer);
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            try {
                yield schema_1.default.Artisan().updateOne({
                    _id: job.artisan
                }, {
                    $set: {
                        start: true
                    }
                });
                console.log('job started');
                response.status(200).send('job started');
                // send notification
                savedTokens = hirer.pushToken;
                console.log(savedTokens);
                //send notification
                let chunks = expo.chunkPushNotifications([{
                        "to": savedTokens,
                        "sound": "default",
                        "channelId": "notification-sound-channel",
                        "title": "Trip Started!",
                        "body": `Your driver has started the trip.`
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
    //check if job has started
    static startedJob(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, name } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            //console.log(user)
            // find artisan
            const job = yield schema_1.default.Job().findOne({ user: uid, $and: [{ category: name }] }).where('status').equals('accepted');
            console.log(job);
            if (job) {
                const findArtisan = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
                //console.log(findArtisan)
                try {
                    response.status(200).send({ artisan: findArtisan.start });
                }
                catch (error) {
                    console.log(error);
                    response.status(404).send("something went wrong");
                }
            }
            else {
                console.log("No Driver Available");
            }
        });
    }
    // driver arrived
    static driverArrived(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_id } = request.body;
            let savedTokens;
            const job = yield schema_1.default.Job().findOne({ _id: job_id });
            //console.log("job found:" + job);
            const driver = yield schema_1.default.Artisan().findOne({ _id: job.artisan });
            //console.log("driver:" + driver)
            const hirer = yield schema_1.default.User().findOne({ _id: job.user });
            //console.log("hirer:" + hirer)
            if (!job && !hirer) {
                return response.status(404).send({
                    message: 'Job does not exist'
                });
            }
            if (driver.arrived === false) {
                try {
                    yield schema_1.default.Artisan().updateOne({
                        _id: job.artisan
                    }, {
                        $set: {
                            arrived: true
                        }
                    });
                    // send notification
                    savedTokens = hirer.pushToken;
                    //console.log(savedTokens)
                    //send notification
                    let chunks = expo.chunkPushNotifications([{
                            "to": savedTokens,
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": "Driver Arrival!",
                            "body": `Your driver has arrived.`
                        }]);
                    let tickets = [];
                    (() => __awaiter(this, void 0, void 0, function* () {
                        for (let chunk of chunks) {
                            try {
                                let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                                console.log(ticketChunk);
                                tickets.push(...ticketChunk);
                                response.status(200).send('driver arrived');
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
            }
            else {
                response.status(200).send('Already Notified');
            }
        });
    }
    //job history 
    static getHistory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            //get user 
            const user = yield schema_1.default.User().findOne({ _id: uid });
            console.log(user);
            //get user jobs
            const job = yield schema_1.default.Job().find({ user: uid }).sort({ '_id': -1 });
            console.log(job);
            if (user) {
                return response.status(200).send({
                    job: job
                });
            }
            else {
                console.log('no user');
                response.status(404).send('no user found');
            }
        });
    }
    //Emergency Call
    //GET DELIVERY REQUESTS
    static Deliveries(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deliveries = yield schema_1.default.Job().find({ 'category': 'log' }).sort({ '_id': -1 });
                console.log(deliveries);
                return response.status(200).send({ value: deliveries });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    //RIDES
    static Rides(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rides = yield schema_1.default.Job().find({ 'category': 'driver' }).sort({ '_id': -1 });
                console.log(rides);
                return response.status(200).send({ value: rides });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
}
exports.default = JobController;
