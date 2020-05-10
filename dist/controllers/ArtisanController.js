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
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const Schema_1 = __importDefault(require("../schema/Schema"));
const Validator_1 = __importDefault(require("../validator/Validator"));
const nodemailer_1 = __importDefault(require("nodemailer"));
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'musty.mohammed1998@gmail.com',
        pass: process.env.PASS
    }
});
class ArtisanController {
    // sign up
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, phone, cpassword } = request.body;
            console.log(request.body);
            try {
                const foundEmail = yield Schema_1.default.Artisan().find({ email: email.trim() });
                if (foundEmail && foundEmail.length > 0) {
                    console.log(foundEmail[0]);
                    return response.status(409).send({
                        message: 'This email already exists',
                        isConfirmed: foundEmail[0].isConfirmed
                    });
                }
                if (cpassword.trim() !== password.trim()) {
                    return response.status(409).send({
                        message: 'The Password do not match'
                    });
                }
                if (!phone) {
                    return response.status(409).send({
                        message: 'Please enter a valid  number',
                    });
                }
                yield Schema_1.default.Artisan().create({
                    name: fullname.trim(),
                    email: email.trim(),
                    password: bcrypt_1.default.hashSync(password.trim(), ArtisanController.generateSalt()),
                    phone,
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
    //continue signup
    static continueSignup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, bio, wage, category, } = request.body;
            console.log(request.body);
            const foundUser = yield Schema_1.default.Artisan().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    yield Schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            bio: bio,
                            wage: wage,
                            category: category
                        }
                    });
                    return response.status(200).send({
                        message: 'User created successfully',
                        status: 201
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: 'something went wrong'
                    });
                }
            }
        });
    }
    //upload images
    static uploadimage(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadDp(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    //set images
    static setId(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield Schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield Schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            idCard: image
                        }
                    });
                    return res.status(200).send("image set");
                }
            }
            catch (error) {
                console.log(error.toString());
                res.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    static setDp(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield Schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield Schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            pic: image
                        }
                    });
                    return res.status(200).send("image set");
                }
            }
            catch (error) {
                console.log(error.toString());
                res.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    //send otp
    static sendOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield Schema_1.default.Artisan()
                    .updateOne({
                    email,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                ArtisanController.sendMail(email, message, 'Registration');
                response.status(200).send({
                    message: 'Please check your email for token'
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
            const { email } = request.body;
            if (!email || !Validator_1.default.validateEmail(email.trim())) {
                return response.status(400).send({
                    message: "Invalid email"
                });
            }
            const user = yield Schema_1.default.Artisan().findOne({ email: email.trim() });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield Schema_1.default.Artisan()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                ArtisanController.sendMail(user.email, message, 'Password change');
                response.status(200).send({
                    message: 'Please check your email for token'
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
            const { confirmationCode, password, email } = request.body;
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
            const user = yield Schema_1.default.Artisan().findOne({ email: email.trim() });
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
                yield Schema_1.default.Artisan()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        password: bcrypt_1.default.hashSync(password.trim(), ArtisanController.generateSalt()),
                    }
                });
                return response.status(200).send({
                    token: ArtisanController.generateToken(user)
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
    static sendMail(email, message, subject = 'Registration') {
        try {
            const msg = {
                to: email,
                from: '"Hawk" <no-reply@thegreenearthcomp.com>',
                subject,
                html: `<p> ${message} </p>`
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
            const { email, password } = request.body;
            const foundUser = yield Schema_1.default.Artisan().findOne({ email: email.trim() });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
                    return response.status(403).send({
                        message: 'Incorrect Password'
                    });
                }
                return response.status(200).send({
                    token: ArtisanController.generateToken(foundUser)
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
            const foundUser = yield Schema_1.default.Artisan().findOne({ email: email.trim() });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
                    return response.status(403).send({
                        message: 'Incorrect Password'
                    });
                }
                return response.status(200).send({
                    token: ArtisanController.generateToken(foundUser)
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
            const { email, confirmationCode } = request.body;
            console.log(confirmationCode);
            const foundUser = yield Schema_1.default.Artisan().findOne({ email });
            console.log(foundUser.confirmationCode);
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (foundUser.confirmationCode !== confirmationCode) {
                    return response.status(403).send({
                        message: 'Incorrect confirmation code'
                    });
                }
                try {
                    yield Schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            isConfirmed: true,
                        }
                    });
                    foundUser.isConfirmed = true;
                    return response.status(200).send({
                        token: ArtisanController.generateToken(foundUser)
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
    //GET USER DETAILS
    static userDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var total = 0;
            const { uid } = request.params;
            console.log(uid);
            try {
                const user = yield Schema_1.default.Artisan().findOne({ _id: uid });
                //console.log(user)
                if (user && Object.keys(user).length) {
                    const getRating = user.rating;
                    console.log(getRating.length);
                    for (var i = 0; i < getRating.length; i++) {
                        total += getRating[i];
                    }
                    var rate = Math.round(total / getRating.length);
                    console.log("rating:" + rate);
                    response.status(200).send({
                        user,
                        rating: rate
                    });
                    // console.log(user)
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
    //location
    static storeLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lat, long, location, area1, area2 } = request.body;
            const { uid } = request.params;
            const user = yield Schema_1.default.Artisan().findOne({ _id: uid });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            try {
                yield Schema_1.default.Artisan()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        lat: lat,
                        long: long,
                        location: location,
                        area1: area1,
                        area2: area2
                    }
                });
                return response.status(200).send("location saved");
            }
            catch (error) {
                console.log(error.toString(), "========");
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
            if (!Expo.isExpoPushToken(token)) {
                console.log("invalid token");
                return response.status(404).send({
                    message: "invalid token"
                });
            }
            try {
                const user = yield Schema_1.default.Artisan().findOne({ _id: uid });
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
                yield Schema_1.default.Artisan()
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
}
exports.default = ArtisanController;
