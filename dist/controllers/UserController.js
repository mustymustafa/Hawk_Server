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
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio_1.default(accountSid, authToken, {
    lazyLoading: true
});
const schema_1 = __importDefault(require("../schema/schema"));
const Validator_1 = __importDefault(require("../validator/Validator"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
/**
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });
*/
class UserController {
    // sign up
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, phone, cpassword } = request.body;
            console.log(request.body);
            try {
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
                if (!phone || phone.length < 14 || phone.length > 14) {
                    return response.status(409).send({
                        message: 'Please enter a valid  number',
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
            const { email } = request.body;
            if (!email || !Validator_1.default.validateEmail(email.trim())) {
                return response.status(400).send({
                    message: "Invalid email"
                });
            }
            const user = yield schema_1.default.User().findOne({ email: email.trim() });
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
            const user = yield schema_1.default.User().findOne({ email: email.trim() });
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
    /**
      static sendMail (email: string, message: string, subject = 'Registration') {
        try{
     
          const msg = {
            to: email,
            from: '"Hawk" <no-reply@thegreenearthcomp.com>',
            subject,
            html: `<p> ${message} </p>`
          };
          transporter.sendMail(msg, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
        } catch (error) {
          console.log(error.toString());
        }
      }
    */
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
            const { email, confirmationCode } = request.body;
            const foundUser = yield schema_1.default.User().findOne({ email });
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
                            promo_date: createdAt,
                            next_promo: now.toLocaleDateString(),
                            promo: true,
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
                const dt = new Date();
                const today = dt.toLocaleDateString();
                console.log(today);
                var now = new Date();
                //after 7 days
                const expire = now.setDate(now.getDate() + 7);
                console.log(now.toLocaleDateString());
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                if (user && Object.keys(user).length) {
                    console.log('Today' + today + 'promo_date:' + user.promo_date);
                    if (today === user.next_promo) {
                        yield schema_1.default.User().updateOne({
                            _id: user._id,
                        }, {
                            $set: {
                                promo: true,
                                promo_date: today,
                                next_promo: now.toLocaleDateString()
                            }
                        });
                    }
                    console.log('Today' + today + 'promo_date:' + user.promo_date);
                    if (today === user.promo_date) {
                        yield schema_1.default.User().updateOne({
                            _id: user._id,
                        }, {
                            $set: {
                                promo: true,
                            }
                        });
                    }
                    if (today != user.promo_date) {
                        yield schema_1.default.User().updateOne({
                            _id: user._id,
                        }, {
                            $set: {
                                promo: false
                            }
                        });
                    }
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
}
exports.default = UserController;
