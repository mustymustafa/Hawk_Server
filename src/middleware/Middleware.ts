import { Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import Validator from '../validator/Validator';

export default class MiddleWare {
  static signupMiddleware(req: Request, res: Response, next: NextFunction) {
    let { email, password, fullname, cpassword, phone, bio, category, wage } = req.body;

    email = email.trim();
    phone=phone
    password = password.trim();
    fullname = fullname.trim();
    //bio = bio.trim();
    //category = category.trim();
    //wage = wage.trim();







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

  


    if(category !== category){
      errors = [...errors, {
        category: 'Please enter a category'
      }]
    }


 //   if(!( (/^[a-z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[a-z][a-z]+$/.test(fullname.trim())) || (/^[a-z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())) || (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(fullname.trim())) )  ){
  if(!fullname || fullname.length < 3){
     
      errors =[
        ...errors, {
        errorMessage: 'Please enter your full name',
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

  static userSignupMiddleware(req: Request, res: Response, next: NextFunction) {
    let { email, password, fullname, cpassword, phone, bio, category, wage } = req.body;

    email = email.trim();
    phone=phone
    password = password.trim();
    fullname = fullname.trim();
    //bio = bio.trim();
    //category = category.trim();
    //wage = wage.trim();







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

  



    if(!( (/^[a-zA-Z .'-]+\s[a-zA-Z .'-]+$/.test(fullname.trim()))  )){
      errors =[
        ...errors, {
        errorMessage: 'Please enter your first and last name',
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
    if (!phone) {
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