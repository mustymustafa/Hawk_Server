"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Validator_1 = __importDefault(require("../validator/Validator"));
class MiddleWare {
    static signupMiddleware(req, res, next) {
        let { email, password, fullname, cpassword, phone, bio, category, wage } = req.body;
        email = email.trim();
        phone = phone;
        password = password.trim();
        fullname = fullname.trim();
        //bio = bio.trim();
        //category = category.trim();
        //wage = wage.trim();
        let errors = [];
        if (!Validator_1.default.validateEmail(email)) {
            errors = [...errors, {
                    email: 'You have not entered an email'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (!phone) {
            errors = [...errors, {
                    phone: 'incorrect phone number entered'
                }];
        }
        if (cpassword !== password) {
            errors = [...errors, {
                    cpassword: 'Passwords do not match'
                }];
        }
        if (bio !== bio) {
            errors = [...errors, {
                    bio: 'Please enter a bio'
                }];
        }
        if (category !== category) {
            errors = [...errors, {
                    category: 'Please enter a category'
                }];
        }
        //   if(!( (/^[a-z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[a-z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())) )  ){
        if (!fullname || fullname.length < 3) {
            errors = [
                ...errors, {
                    errorMessage: 'Please enter your full name',
                }
            ];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static userSignupMiddleware(req, res, next) {
        let { email, password, fullname, cpassword, phone, bio, category, wage } = req.body;
        email = email.trim();
        phone = phone;
        password = password.trim();
        fullname = fullname.trim();
        //bio = bio.trim();
        //category = category.trim();
        //wage = wage.trim();
        let errors = [];
        if (!Validator_1.default.validateEmail(email)) {
            errors = [...errors, {
                    email: 'You have not entered an email'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (!phone) {
            errors = [...errors, {
                    phone: 'incorrect phone number entered'
                }];
        }
        if (cpassword !== password) {
            errors = [...errors, {
                    cpassword: 'Passwords do not match'
                }];
        }
        if (bio !== bio) {
            errors = [...errors, {
                    bio: 'Please enter a bio'
                }];
        }
        if (category !== category) {
            errors = [...errors, {
                    category: 'Please enter a category'
                }];
        }
        if (!((/^[a-z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[a-z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())))) {
            errors = [
                ...errors, {
                    errorMessage: 'Please enter your full name',
                }
            ];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static signinMiddleware(req, res, next) {
        let { email, password, } = req.body;
        email = email.trim();
        password = password.trim();
        let errors = [];
        if (!Validator_1.default.validateEmail(email)) {
            errors = [...errors, {
                    email: 'You have not entered an email'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static signinPhoneMiddleware(req, res, next) {
        let { phone, password, fullname } = req.body;
        phone = phone.trim();
        password = password.trim();
        let errors = [];
        if (!phone) {
            errors = [...errors, {
                    phone: 'incorrect phone number entered'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static authorization(req, res, next) {
        const token = req.headers['x-access-token'];
        if (token && process.env.SECRET) {
            jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    res.status(403).send({
                        message: 'Expired session. Please login'
                    });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.status(403).send({
                message: 'Expired session. Please login'
            });
        }
    }
}
exports.default = MiddleWare;
