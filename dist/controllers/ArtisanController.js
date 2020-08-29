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
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
const schema_1 = __importDefault(require("../schema/schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
function addWeek(date, week) {
    console.log(date);
    const d = date.getDate();
    date.setDate(date.getDate() + +week);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    console.log(date);
    return date;
}
class ArtisanController {
    // sign up
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, phone, cpassword, country } = request.body;
            console.log(phone);
            try {
                const foundEmail = yield schema_1.default.Artisan().find({ phone: phone.trim() });
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
                yield schema_1.default.Artisan().create({
                    name: fullname.trim(),
                    country: country,
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
            const { email, bio, wage, category, vl_expiry, id_expiry, vcolor, vmodel, plate, sname, sphone, vyear } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.Artisan().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    const dt = new Date();
                    const createdAt = dt.toLocaleDateString();
                    console.log(createdAt);
                    var now = new Date();
                    //after 7 days
                    const expire = now.setDate(now.getDate() + 7);
                    console.log(now.toLocaleDateString());
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            bio: bio,
                            //  wage: wage,
                            category: category,
                            id_expiry: id_expiry,
                            vl_expiry: vl_expiry,
                            vcolor: vcolor,
                            vmodel: vmodel,
                            vyear: vyear,
                            plate: plate,
                            sname: sname,
                            sphone: sphone,
                            createdAt: createdAt,
                            expireAt: now.toLocaleDateString()
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
    //update profile
    static updateArtisan(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, bio, wage, phone, name } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.Artisan().findOne({ _id: uid });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                if (!bio) {
                    return response.status(409).send({
                        message: 'Please enter a bio',
                    });
                }
                if (!((/^[a-z][a-z]+\s[a-z][a-z]+$/.test(name.trim())) || (/^[A-Z][a-z]+\s[a-z][a-z]+$/.test(name.trim())) || (/^[a-z][a-z]+\s[A-Z][a-z]+$/.test(name.trim())) || (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(name.trim())))) {
                    return response.status(409).send({
                        message: 'Please enter a valid name',
                    });
                }
                if (!wage) {
                    return response.status(409).send({
                        message: 'Please enter a wage',
                    });
                }
                if (!phone || phone.length < 11 || phone.length > 11) {
                    return response.status(409).send({
                        message: 'Please enter a valid phone',
                    });
                }
                try {
                    yield schema_1.default.Artisan().updateOne({
                        _id: uid
                    }, {
                        $set: {
                            bio: bio,
                            wage: wage,
                            phone: phone,
                            name: name
                        }
                    });
                    return response.status(200).send({
                        message: 'User updated successfully',
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
    //update artisan location
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
    static uploadVl(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadIns(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadPoo(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadVir(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadVpic(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadCert(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadSchool(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static uploadCac(req, res) {
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
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
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
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
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
    static setCert(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            cert: image
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
    static setVl(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            vl: image
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
    static setIns(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            insurance: image
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
    static setPoo(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            poo: image
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
    static setVir(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            vir: image
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
    static setVpic(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            vpic: image
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
    static setSchool(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            school: image
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
    // set CAC
    static setCac(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.Artisan().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            cac: image
                        }
                    });
                    return res.status(200).send("cac set");
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
    //set id_expiry
    static idExpiry(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id_expiry, } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.Artisan().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            id_expiry: id_expiry,
                        }
                    });
                    return response.status(200).send({
                        message: 'User updated successfully',
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
    //set vehicle details
    //continue signup
    static vehicleDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, phone, vl_expiry, vcolor, vmodel, plate, sname, sphone, vyear } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.Artisan().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            vl_expiry: vl_expiry,
                            vcolor: vcolor,
                            vmodel: vmodel,
                            vyear: vyear,
                            plate: plate,
                            sname: sname,
                            sphone: sphone
                        }
                    });
                    return response.status(200).send({
                        message: 'User updated successfully',
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
    //send otp
    static sendOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = request.body;
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.Artisan()
                    .updateOne({
                    phone,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                //ArtisanController.sendMail(email, message, 'Registration');
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
            const user = yield schema_1.default.Artisan().findOne({ phone: phone.trim() });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.Artisan()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        confirmationCode
                    }
                });
                const message = `Token: ${confirmationCode}`;
                //ArtisanController.sendMail(user.email, message, 'Password change');
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
            const user = yield schema_1.default.Artisan().findOne({ phone: phone.trim() });
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
                yield schema_1.default.Artisan()
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
    //sign in
    static signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone, password } = request.body;
            console.log(phone);
            const foundUser = yield schema_1.default.Artisan().findOne({ phone: phone.trim() });
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
    //ADMIN SIGN  IN
    static adminSignin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            console.log(email);
            const foundUser = yield schema_1.default.Artisan().findOne({ email: email.trim() });
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
            const foundUser = yield schema_1.default.Artisan().findOne({ email: email.trim() });
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
            const { phone, confirmationCode } = request.body;
            console.log(confirmationCode);
            const foundUser = yield schema_1.default.Artisan().findOne({ phone });
            console.log(foundUser.confirmationCode);
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (foundUser.confirmationCode !== confirmationCode) {
                    return response.status(403).send({
                        message: 'Incorrect confirmation code'
                    });
                }
                try {
                    yield schema_1.default.Artisan().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            isConfirmed: true,
                            active: true
                        }
                    });
                    foundUser.isConfirmed = true;
                    ArtisanController.sendMail('support@platabox.com', 'New Registration Request. Please attend to it now.', 'New Registration');
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
    //get Drivers
    static Drivers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const drivers = yield schema_1.default.Artisan().find({ 'category': 'driver' }).where({ 'active': true }).sort({ '_id': -1 });
                console.log(drivers);
                return response.status(200).send({ value: drivers });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    static Logs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logs = yield schema_1.default.Artisan().find({ 'category': 'log' }).where({ 'active': true }).sort({ '_id': -1 });
                console.log(logs);
                return response.status(200).send({ value: logs });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    //get registratins 
    static getLogRegistartion(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield schema_1.default.Artisan().find({ 'category': 'log' }).where({ 'active': false }).sort({ '_id': -1 });
                console.log(registrations);
                return response.status(200).send({ value: registrations });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    static getDriverRegistartion(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield schema_1.default.Artisan().find({ 'category': 'driver' }).where({ 'active': false }).sort({ '_id': -1 });
                console.log(registrations);
                return response.status(200).send({ value: registrations });
            }
            catch (error) {
                console.log(error.toString());
                return response.status(500).send({
                    message: 'something went wrong'
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
            var amount = 0;
            const { uid } = request.params;
            console.log(uid);
            try {
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
                //console.log(user)
                if (user && Object.keys(user).length) {
                    //get Rating
                    const getRating = user.rating;
                    console.log(getRating.length);
                    //get Earnings
                    const getEarnings = user.earnings;
                    console.log(getEarnings);
                    // get rate
                    for (var i = 0; i < getRating.length; i++) {
                        total += getRating[i];
                    }
                    var rate = Math.round(total / getRating.length);
                    console.log("rating:" + rate);
                    //get total amount
                    for (var i = 0; i < getEarnings.length; i++) {
                        amount += getEarnings[i];
                    }
                    console.log('amount:' + amount);
                    //amount to pay
                    var pay = Math.round(amount * 0.25);
                    console.log('pay' + pay);
                    response.status(200).send({
                        user,
                        rating: rate,
                        earning: amount,
                        pay: pay
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
    //update status on payment
    static activateAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            //const expire =  addWeek(new Date(), 1).toLocaleDateString();
            var now = new Date();
            //after 7 days
            const expire = now.setDate(now.getDate() + 7);
            console.log(now.toLocaleDateString());
            try {
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
                if (user) {
                    yield schema_1.default.Artisan().updateOne({ _id: uid }, {
                        $set: {
                            active: true,
                            expireAt: now.toLocaleDateString(),
                            earnings: user.earnings.splice(0, user.earnings.length)
                        }
                    });
                    response.status(200).send({
                        message: 'Account Activated!'
                    });
                }
                else {
                    response.status(404).send({
                        message: 'Cannot find details for this user'
                    });
                }
            }
            catch (error) {
                response.status(404).send({ error: 'could not complete your request at the moment' });
            }
        });
    }
    //location
    static storeLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lat, long, location, area1, area2, city } = request.body;
            const { uid } = request.params;
            const user = yield schema_1.default.Artisan().findOne({ _id: uid });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            try {
                yield schema_1.default.Artisan()
                    .updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        lat: lat,
                        long: long,
                        location: location,
                        area1: area1,
                        area2: area2,
                        city: city
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
    //update lat and long while moving
    static updateLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lat, long } = request.body;
            const { uid } = request.params;
            const user = yield schema_1.default.Artisan().findOne({ _id: uid });
            if (!user) {
                return response.status(404).send({
                    message: 'User does not exist'
                });
            }
            try {
                yield schema_1.default.Artisan()
                    .updateOne({
                    _id: uid,
                }, {
                    $set: {
                        lat: lat,
                        long: long
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
    //get artisan  lat and long
    static artisanLoc(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            //console.log("uid" + uid)
            try {
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
                //console.log(user)
                if (user) {
                    response.status(200).send({
                        lat: user.lat,
                        long: user.long
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
    //get all drivers
    static getDrivers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield schema_1.default.Artisan().find({ category: 'driver' });
                if (user) {
                    console.log(user);
                    return response.status(200).send({ user });
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
    //Get all logistics
    static getLog(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield schema_1.default.Artisan().find({ category: 'log' });
                if (user) {
                    console.log(user);
                    return response.status(200).send({ user });
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
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
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
                yield schema_1.default.Artisan()
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
    //ADMIN ACTIVATE
    //update status on payment
    static adminActivate(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            //const expire =  addWeek(new Date(), 1).toLocaleDateString();
            var now = new Date();
            //after 7 days
            const expire = now.setDate(now.getDate() + 7);
            console.log(now.toLocaleDateString());
            try {
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
                if (user) {
                    yield schema_1.default.Artisan().updateOne({ _id: uid }, {
                        $set: {
                            active: true,
                            expireAt: now.toLocaleDateString(),
                            earnings: user.earnings.splice(0, user.earnings.length)
                        }
                    });
                    response.status(200).send({
                        message: 'Account Activated!'
                    });
                    //send notification
                    let chunks = expo.chunkPushNotifications([{
                            "to": user.pushToken,
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": 'Account Activated !',
                            "body": "You are now a Platabox Driver :)"
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
                    ArtisanController.sendMail(user.email, 'Account Activated. you can start using Platabox Driver now and start earning more money!.', 'Activated');
                }
                else {
                    response.status(404).send({
                        message: 'Cannot find details for this user'
                    });
                }
            }
            catch (error) {
                response.status(404).send({ error: 'could not complete your request at the moment' });
            }
        });
    }
    //ADMIN DEACTIVATE
    //update status on payment
    static deactivateAccount(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.body;
            //const expire =  addWeek(new Date(), 1).toLocaleDateString();
            var now = new Date();
            //after 7 days
            const expire = now.setDate(now.getDate() + 7);
            console.log(now.toLocaleDateString());
            try {
                const user = yield schema_1.default.Artisan().findOne({ _id: uid });
                if (user) {
                    yield schema_1.default.Artisan().updateOne({ _id: uid }, {
                        $set: {
                            active: false,
                            expireAt: '',
                            earnings: user.earnings.splice(0, user.earnings.length)
                        }
                    });
                    response.status(200).send({
                        message: 'Account De-activated!'
                    });
                    //send notification
                    let chunks = expo.chunkPushNotifications([{
                            "to": user.pushToken,
                            "sound": "default",
                            "channelId": "notification-sound-channel",
                            "title": "Account De-activated",
                            "body": "You are no longer a Platabox Driver"
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
                    ArtisanController.sendMail(user.email, 'Your account has been disabled for a reason. Contact us to see what went wrong.', 'De-activated');
                }
                else {
                    response.status(404).send({
                        message: 'Cannot find details for this user'
                    });
                }
            }
            catch (error) {
                response.status(404).send({ error: 'could not complete your request at the moment' });
            }
        });
    }
}
exports.default = ArtisanController;
