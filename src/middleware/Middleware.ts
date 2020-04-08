import { Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import Validator from '../validator/Validator';

export default class MiddleWare {
  static signupMiddleware(req: Request, res: Response, next: NextFunction) {
    let { email, password, fullname, cpassword, phone } = req.body;

    email = email.trim();
    phone=phone.trim();
    password = password.trim();
    fullname = fullname.trim();

    let errors: {[error: string]: string}[] = []
    if (!Validator.validateEmail(email)) {
      errors = [...errors, {
        email: 'You have not entered an email'
      }]
    }
    if (password.trim().length < 6) {
      errors = [...errors, {
        password: 'Password is too short'
      }]
    }

    if (!phone) {
      errors = [...errors, {
        phone: 'incorrect phone number entered'
      }]
    }
    

    if(cpassword !== password){
      errors = [...errors, {
        cpassword: 'Passwords do not match'
      }]
    }
    if (fullname.trim().length < 2) {
      errors = [
        ...errors, {
          fullname: 'Full name is too short'
        }
      ]
    }
    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }

  static signinMiddleware (req: Request, res: Response, next: NextFunction) {
    let { email, password,  } = req.body;

    email = email.trim();
    password = password.trim();

    let errors: {[error: string]: string}[] = []
    if (!Validator.validateEmail(email)) {
      errors = [...errors, {
        email: 'You have not entered an email'
      }]
    }

    if (password.trim().length < 6) {
      errors = [...errors, {
        password: 'Password is too short'
      }]
    }

    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }

  static signinPhoneMiddleware (req: Request, res: Response, next: NextFunction) {
    let { phone, password, fullname } = req.body;

    phone = phone.trim();
    password = password.trim();

    let errors: {[error: string]: string}[] = []
    if (!phone || phone < 10 || phone > 10) {
        errors = [...errors, {
          phone: 'incorrect phone number entered'
        }]
      }

    if (password.trim().length < 6) {
      errors = [...errors, {
        password: 'Password is too short'
      }]
    }

    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }

  

  

  static authorization (req: any, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'];
    if (token && process.env.SECRET) {
      jwt.verify(token, process.env.SECRET, (err: any, decoded: any) => {
        if (err) {
          res.status(403).send({
            message: 'Expired session. Please login'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({
        message: 'Expired session. Please login'
      });
    }
  }

  
}