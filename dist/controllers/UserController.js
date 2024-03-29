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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const request_1 = __importDefault(require("request"));
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio_1.default(accountSid, authToken, {
    lazyLoading: true
});
const schema_1 = __importDefault(require("../schema/schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
const Flutterwave = require('flutterwave-node-v3');
const rave = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);
//date initialization
const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + '/' + day + '/' + year;
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'musty.mohammed1998@gmail.com',
        pass: process.env.PASS
    }
});
class UserController {
    // sign up
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, phone, cpassword, country } = request.body;
            console.log(request.body);
            try {
                if (!phone || phone.length != 14) {
                    return response.status(409).send({
                        message: 'Please enter a valid  number',
                    });
                }
                const foundEmail = yield schema_1.default.User().find({ phone: phone.trim() });
                if (foundEmail && foundEmail.length > 0) {
                    console.log(foundEmail[0]);
                    return response.status(409).send({
                        message: 'This number already exists',
                        isConfirmed: foundEmail[0].isConfirmed
                    });
                }
                if (cpassword.trim() !== password.trim()) {
                    return response.status(409).send({
                        message: 'The Password do not match'
                    });
                }
                const confirmationCode = String(Date.now()).slice(9, 13);
                const message = `Verification code: ${confirmationCode}`;
                //UserController.sendMail(email.trim(), message)
                client.messages
                    .create({
                    body: message,
                    from: '+17076402854',
                    to: phone
                })
                    .then(response => console.log(response.sid));
                yield schema_1.default.User().create({
                    name: fullname.trim(),
                    country: country,
                    email: email.trim(),
                    password: bcrypt_1.default.hashSync(password.trim(), UserController.generateSalt()),
                    phone,
                    confirmationCode,
                    isConfirmed: false
                });
                response.status(201).send({
                    message: 'User created successfully',
                    status: 201
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
    //send otp
    static resendOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = request.body;
            console.log(phone);
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.User()
                    .updateOne({
                    phone,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                //UserController.sendMail(email, message, 'Registration');
                client.messages
                    .create({
                    body: message,
                    from: '+17076402854',
                    to: phone
                })
                    .then(response => console.log(response.sid));
                response.status(200).send({
                    message: 'Please check your phone for token'
                });
                return;
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //forgot password
    static forgotPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = request.body;
            const user = yield schema_1.default.User().findOne({ phone: phone.trim() });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.User()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                // UserController.sendMail(user.email, message, 'Password change');
                client.messages
                    .create({
                    body: message,
                    from: '+17076402854',
                    to: user.phone
                })
                    .then(response => console.log(response.sid));
                response.status(200).send({
                    message: 'Please check your phone for token'
                });
                return;
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //change password
    static changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { confirmationCode, password, phone } = request.body;
            if (!confirmationCode || !confirmationCode.trim()) {
                return response.status(400).send({
                    message: "Token is required"
                });
            }
            if (!password || !password.trim()) {
                return response.status(400).send({
                    message: "Password is required"
                });
            }
            const user = yield schema_1.default.User().findOne({ phone: phone.trim() });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            if (user.confirmationCode !== confirmationCode) {
                return response.status(403).send({
                    message: "Incorrect token code"
                });
            }
            try {
                yield schema_1.default.User()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        password: bcrypt_1.default.hashSync(password.trim(), UserController.generateSalt()),
                    }
                });
                return response.status(200).send({
                    token: UserController.generateToken(user)
                });
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    static sendMail(email, message, subject) {
        try {
            const msg = {
                to: email,
                from: '"Platabox" <no-reply@support@platabox.com>',
                subject,
                html: `<p> ${message}</p>`
            };
            transporter.sendMail(msg, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        catch (error) {
            console.log(error.toString());
        }
    }
    //sign in
    static signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = request.body;
            console.log(phone);
            const foundUser = yield schema_1.default.User().findOne({ phone: phone.trim() });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
                    return response.status(403).send({
                        message: 'Incorrect Password'
                    });
                }
                return response.status(200).send({
                    token: UserController.generateToken(foundUser)
                });
            }
            else {
                return response.status(401).send({
                    message: 'Incorrect Username or Password'
                });
            }
        });
    }
    //sign in with phone
    static signinPhone(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const foundUser = yield schema_1.default.User().findOne({ email: email.trim() });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
                    return response.status(403).send({
                        message: 'Incorrect Password'
                    });
                }
                return response.status(200).send({
                    token: UserController.generateToken(foundUser)
                });
            }
            else {
                return response.status(401).send({
                    message: 'Incorrect Username or Password'
                });
            }
        });
    }
    //confrimation code
    static confirm(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, confirmationCode } = request.body;
            const foundUser = yield schema_1.default.User().findOne({ phone });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (foundUser.confirmationCode !== confirmationCode) {
                    return response.status(403).send({
                        message: 'Incorrect confirmation code'
                    });
                }
                try {
                    const dt = new Date();
                    const createdAt = dt.toLocaleDateString();
                    console.log(createdAt);
                    var now = new Date();
                    //after 7 days
                    const promo = now.setDate(now.getDate() + 7);
                    console.log(now.toLocaleDateString());
                    yield schema_1.default.User().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            isConfirmed: true,
                            createdAt: createdAt
                        }
                    });
                    foundUser.isConfirmed = true;
                    return response.status(200).send({
                        token: UserController.generateToken(foundUser)
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: 'something went wrong'
                    });
                }
            }
            else {
                return response.status(401).send({
                    message: 'Incorrect Username or Password'
                });
            }
        });
    }
    static generateSalt() {
        return bcrypt_1.default.genSaltSync(10);
    }
    //generate token
    static generateToken(user) {
        return process.env.SECRET && jsonwebtoken_1.default.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isConfirmed: user.isConfirmed
        }, process.env.SECRET, { expiresIn: 100 * 60 * 60 });
    }
    static userDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            console.log(uid);
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                if (user && Object.keys(user).length) {
                    response.status(200).send({
                        user
                    });
                    console.log(user);
                }
                else {
                    response.status(404).send({
                        message: 'Cannot find details for this user'
                    });
                    console.log("not found");
                }
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    static savePushToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            const token = request.body.token;
            console.log(token);
            //check token
            if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
                console.log("invalid token");
                return response.status(404).send({
                    message: "invalid token"
                });
            }
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                if (!user) {
                    return response.status(404).send({
                        message: 'User does not exist'
                    });
                }
                if (user.pushToken === token) {
                    console.log("token exists already");
                    return response.status(404).send({
                        message: 'token exists already'
                    });
                }
                yield schema_1.default.User()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        pushToken: token,
                    }
                });
                return response.status(200).send("token saved");
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //get users
    static Users(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield schema_1.default.User().find({}).sort({ '_id': -1 });
                console.log(users);
                return response.status(200).send({ value: users });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    //******PLATABOX WALLET */
    //FUND ACCOUNT
    static fundWallet(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, uid } = request.body;
            console.log(amount);
            console.log(uid);
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                const new_amount = parseInt(user.balance) + parseInt(amount);
                console.log("new amount " + new_amount);
                if (user) {
                    //update amount
                    yield schema_1.default.User()
                        .updateOne({
                        _id: uid,
                    }, {
                        $set: {
                            balance: new_amount,
                        }
                    });
                    yield schema_1.default.Transaction().create({
                        user: uid,
                        amount: amount,
                        status: 'funded',
                        date: today
                    });
                    return response.status(200).send({
                        message: 'Account Funded!'
                    });
                }
                else {
                    console.log('User not found');
                    return response.status(500).send({
                        message: 'User not found'
                    });
                }
            }
            catch (err) {
                console.log(err);
                return response.status(500).send({
                    message: 'An error occured'
                });
            }
        });
    }
    //create withdraw TOKEN
    static withdrawToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            console.log(user);
            if (user) {
                const otp = String(Date.now()).slice(9, 13);
                yield schema_1.default.User()
                    .updateOne({
                    _id: uid,
                }, {
                    $set: {
                        otp: otp,
                    }
                });
                const message = `Withdrawal Token: ${otp}`;
                client.messages
                    .create({
                    body: message,
                    from: '+17076402854',
                    to: user.phone
                });
                response.send('Token sent');
            }
            else {
                response.status(400).send({ error: "user not found" });
            }
        });
    }
    //WITHDRAW FUNDS
    static withdrawFund(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, bcode, amount, anumber, otp, } = req.body;
            //check if user has an ongoing request
            const job = yield schema_1.default.Job().findOne({ user: uid }).where({ status: 'accepted' });
            if (job) {
                response.status(401).send({ message: "You can't withdraw funds until your last request is completed. Try again later :)" });
            }
            //check balance in platabox account
            var options = {
                'method': 'GET',
                'url': 'https://api.flutterwave.com/v3/balances/NGN',
                'headers': {
                    'Authorization': `Bearer ${process.env.SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            };
            request_1.default(options, (error, resp) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                ;
                console.log(resp.body);
                console.log(parseInt(resp.body.split(":")[5].split(",")[0]));
                var balance = parseInt(resp.body.split(":")[5].split(",")[0]);
                try {
                    const user = yield schema_1.default.User().findOne({ _id: uid });
                    const admin = yield schema_1.default.User().findOne({ phone: '+2349038826995' });
                    console.log(user);
                    const new_amount = parseInt(user.balance) - parseInt(amount);
                    const limit = parseInt(user.balance) - 50;
                    console.log(limit);
                    if (user) {
                        //check if amount the amount is greatr than the limit
                        if (anumber.length > 10 || anumber.length < 10) {
                            return response.send({ message: "Account number should be 10 digits" });
                        }
                        if (amount > limit) {
                            return response.send({ message: `The specified amount is more than your withdrawal limit: ${limit}` });
                        }
                        if (balance < amount) {
                            if (admin) {
                                //notify admin
                                let chunks = expo.chunkPushNotifications([{
                                        "to": admin.pushToken,
                                        "sound": "default",
                                        "channelId": "notification-sound-channel",
                                        "title": "Insufficient wallet Balance!",
                                        "body": `Check wallet balance ASAP!.`
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
                                UserController.sendMail('mustapha.mohammed1@aun.edu.ng', 'Insufficient wallet Balance!', 'Check wallet balance ASAP!.');
                            }
                            return response.status(400).send({ message: 'Service is busy at the moment due to high number of requests. Please try again in a few minute :)' });
                        }
                        else {
                            //verify token
                            /**if(user.otp != otp){
                              response.status(400).send({error: 'The OTP you entered is incorrect. Please try again'})
                            }*/
                            const payload = {
                                "account_bank": bcode,
                                "account_number": anumber,
                                "amount": amount,
                                "narration": `Platabox Wallet Withdrawal of ${amount}`,
                                "currency": "NGN",
                                "debit_currency": "NGN",
                                "reference": "pbwd-" + Date.now()
                            };
                            const resp = yield rave.Transfer.initiate(payload);
                            console.log(resp);
                            if (resp.data.fullname === 'N/A') {
                                console.log('Invalid account number');
                                return response.send({
                                    message: 'Invalid account number'
                                });
                            }
                            if (resp.data.status === 'FAILED') {
                                console.log('transaction failed. Please try again later');
                                return response.send({
                                    message: 'Transaction failed. Please check your account details and try again'
                                });
                            }
                            if (resp.data.status === 'NEW') {
                                console.log('Transaction Successful');
                                // if successful
                                // send success message
                                //remove amount
                                yield schema_1.default.User()
                                    .updateOne({
                                    _id: uid,
                                }, {
                                    $set: {
                                        balance: new_amount,
                                    }
                                });
                                yield schema_1.default.Transaction().create({
                                    user: uid,
                                    amount: amount,
                                    status: 'withdraw',
                                    date: today
                                });
                                console.log('new amount ' + new_amount);
                                return response.send({
                                    message: 'Transaction Successful'
                                });
                            }
                        }
                    }
                    else {
                        return response.send({ message: "User not found" });
                    }
                }
                catch (error) {
                    console.log(error);
                    return response.status(401).send({
                        message: 'Something went wrong. please try again'
                    });
                }
            }));
        });
    }
    //MANUALLY TRANSFER FUNDS THROUGH BANK TRANSFER
    //SAVE THE TRANSFER REQUESTS HERE
    static transferRequests(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, uid, anumber, bank } = req.body;
            console.log(bank);
            console.log(anumber);
            console.log(uid);
            //check if user has an ongoing request
            const job = yield schema_1.default.Job().findOne({ user: uid }).where({ status: 'accepted' });
            if (job) {
                response.status(401).send({ message: "You can't withdraw funds until your last request is completed. Try again later :)" });
            }
            //check balance in platabox account
            var options = {
                'method': 'GET',
                'url': 'https://api.flutterwave.com/v3/balances/NGN',
                'headers': {
                    'Authorization': `Bearer ${process.env.SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            };
            request_1.default(options, (error, resp) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                }
                ;
                console.log(parseInt(resp.body.split(":")[5].split(",")[0]));
                var balance = parseInt(resp.body.split(":")[5].split(",")[0]);
                try {
                    const user = yield schema_1.default.User().findOne({ _id: uid });
                    const admin = yield schema_1.default.User().findOne({ phone: '+2349038826995' });
                    console.log(user);
                    console.log(admin);
                    const limit = parseInt(user.balance) - 50;
                    if (user) {
                        //SAVE THE TRANSFER REQUEST
                        if (anumber.length > 10 || anumber.length < 10) {
                            return response.send({ message: "Account number should be 10 digits" });
                        }
                        if (amount > limit) {
                            return response.send({ message: `The specified amount is more than your withdrawal limit: ${limit}` });
                        }
                        if (balance < amount) {
                            if (admin) {
                                //notify admin
                                let chunks = expo.chunkPushNotifications([{
                                        "to": admin.pushToken,
                                        "sound": "default",
                                        "channelId": "notification-sound-channel",
                                        "title": "Insufficient wallet Balance!",
                                        "body": `Check wallet balance ASAP!.`
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
                            return response.status(400).send({ message: 'Service is busy at the moment due to high number of requests. Please try again in a few minute :)' });
                        }
                        yield schema_1.default.Transfers().create({
                            user: uid,
                            amount: amount,
                            anumber: anumber,
                            bank: bank,
                            status: 'transfer',
                            date: today
                        });
                        if (admin) {
                            //notify admin
                            let chunks = expo.chunkPushNotifications([{
                                    "to": admin.pushToken,
                                    "sound": "default",
                                    "channelId": "notification-sound-channel",
                                    "title": "Transfer Request!",
                                    "body": `Please attend to the transfer request ASAP!.`
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
                        return response.status(200).send({
                            message: 'Transfer Request Funded!'
                        });
                    }
                    else {
                        console.log('User not found');
                        return response.status(500).send({
                            message: 'User not found'
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                    return response.status(500).send({
                        message: 'An error occured'
                    });
                }
            }));
        });
    }
    //UPDATE A TRANSFER REQUEST
    static updateTransfer(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, uid } = request.body;
            console.log(amount);
            console.log(uid);
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                const new_amount = user.balance - amount;
                console.log("new amount " + new_amount);
                if (user) {
                    //update amount
                    yield schema_1.default.User()
                        .updateOne({
                        _id: uid,
                    }, {
                        $set: {
                            balance: new_amount,
                        }
                    });
                    yield schema_1.default.Transaction().create({
                        user: uid,
                        amount: amount,
                        status: 'withdraw',
                        date: today
                    });
                    return response.status(200).send({
                        message: 'Re-Funded!'
                    });
                }
                else {
                    console.log('User not found');
                    return response.status(500).send({
                        message: 'User not found'
                    });
                }
            }
            catch (err) {
                console.log(err);
                return response.status(500).send({
                    message: 'An error occured'
                });
            }
        });
    }
    //GET TRANSACTIONS
    static allTrans(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                const trans = yield schema_1.default.Transaction().find({ user: uid }).sort({ '_id': -1 });
                console.log(trans);
                if (user) {
                    response.status(200).send({ trans: trans });
                }
                else {
                    response.status(500).send({ error: 'Could not find Transactions for this user' });
                }
            }
            catch (error) {
                console.log(error);
                response.status(500).send('Something went wrong');
            }
        });
    }
    //GET ALL TRANS
    //GET TRANSACTIONS
    static getTrans(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trans = yield schema_1.default.Transaction().find().sort({ '_id': -1 });
                console.log(trans);
                if (trans) {
                    response.status(200).send({ trans: trans });
                }
                else {
                    response.status(500).send({ error: 'Could not find Transactions for this user' });
                }
            }
            catch (error) {
                console.log(error);
                response.status(500).send('Something went wrong');
            }
        });
    }
    //emergency
    static emergencyContact(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, phone, email, name } = request.body;
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                if (user) {
                    yield schema_1.default.User()
                        .updateOne({
                        _id: uid,
                    }, {
                        $set: {
                            ename: name,
                            ephone: phone,
                            eemail: email,
                        }
                    });
                    response.status(200).send({ message: 'Emergency contact added!' });
                }
                else {
                    response.status(404).send({ message: 'User not found' });
                }
            }
            catch (err) {
                console.log(err);
                return response.status(500).send({
                    message: 'An error occured'
                });
            }
        });
    }
    static Emergency(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, dic, location } = request.body;
            response.status(200).send({ message: 'emergency reported' });
        });
    }
}
exports.default = UserController;
