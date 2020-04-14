import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";



import Schema from '../schema/Schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });

class UserController {


    // sign up
  static async signup (request: Request, response: Response) {
    const {
      fullname, email, password, phone, cpassword
    } = request.body;

    console.log(request.body);

    try {
      const foundEmail = await Schema.User().find({email: email.trim()});
      if (foundEmail && foundEmail.length > 0) {

        console.log(foundEmail[0])
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
  
      const confirmationCode = String(Date.now()).slice(9, 13);
      const message = `Verification code: ${confirmationCode}`
      UserController.sendMail(email.trim(), message)
      
      await Schema.User().create({
        name: fullname.trim(),
        email: email.trim(),
        password: bcrypt.hashSync(password.trim(), UserController.generateSalt()),
        phone,
        confirmationCode,
        isConfirmed: false
      });

      response.status(201).send({
        message: 'User created successfully',
        status: 201
      });
    } catch (error) {
      console.log(error.toString());
      response.status(500).send({
        message: "Somenthing went wrong"
      })
    }
  }

  //send otp
  static async resendOtp(request: Request, response: Response) {
    const {
      email
    } = request.body;

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.User()
        .updateOne({
          email,
        }, {
        $set: {
          confirmationCode
        }
      });
      const message = `Token: ${confirmationCode}`;
      UserController.sendMail(email, message, 'Registration');
      response.status(200).send({
        message: 'Please check your email for token'
      });
      return;
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }

  //forgot password
  static async forgotPassword (request: Request, response: Response) {
    const {
      email
    } = request.body;
    if (!email || !Validator.validateEmail(email.trim())) {
      return response.status(400).send({
        message: "Invalid email"
      });
    }
    const user = await Schema.User().findOne({email: email.trim()});
    if (!user) {
      return response.status(404).send({
        message: 'User does not exist'
      });
    }

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.User()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          confirmationCode
        }
      });
      const message = `Token: ${confirmationCode}`;
      UserController.sendMail(user.email, message, 'Password change');
      response.status(200).send({
        message: 'Please check your email for token'
      });
      return;
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }

  //change password
  static async changePassword (request: Request, response: Response) {
    const {
      confirmationCode,
      password,
      email
    } = request.body;
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
    const user = await Schema.User().findOne({email: email.trim()});
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
      await Schema.User()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          password: bcrypt.hashSync(password.trim(), UserController.generateSalt()),
        }
      });
      return response.status(200).send({
        token: UserController.generateToken(user)
      });
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }

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


  


  

//sign in
  static async signin (request: Request, response: Response) {
    const {
      email, password
    } = request.body;

    const foundUser:any = await Schema.User().findOne({email: email.trim()});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (!bcrypt.compareSync(password, foundUser.password)) {
        return response.status(403).send({
          message: 'Incorrect Password'
        });
      }
      return response.status(200).send({
        token: UserController.generateToken(foundUser)
      });
    } else {
      return response.status(401).send({
        message: 'Incorrect Username or Password'
      });
    }
  }

  //sign in with phone
  static async signinPhone (request: Request, response: Response) {
    const {
      email, password
    } = request.body;

    const foundUser:any = await Schema.User().findOne({email: email.trim()});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (!bcrypt.compareSync(password, foundUser.password)) {
        return response.status(403).send({
          message: 'Incorrect Password'
        });
      }
      return response.status(200).send({
        token: UserController.generateToken(foundUser)
      });
    } else {
      return response.status(401).send({
        message: 'Incorrect Username or Password'
      });
    }
  }

  //confrimation code
  static async confirm (request: Request, response: Response) {
    const {
      email, confirmationCode
    } = request.body;

    const foundUser:any = await Schema.User().findOne({email});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (foundUser.confirmationCode !== confirmationCode) {
        return response.status(403).send({
          message: 'Incorrect confirmation code'
        });
      }
      try {
        await Schema.User().updateOne({
          _id: foundUser._id
        }, {
          $set: {
            isConfirmed: true,
          }
        });

        foundUser.isConfirmed = true;
        return response.status(200).send({
          token: UserController.generateToken(foundUser)
        });
      } catch (error) {
        console.log(error.toString());
        response.status(500).send({
          message: 'something went wrong'
        });
      }
    } else {
      return response.status(401).send({
        message: 'Incorrect Username or Password'
      });
    }
  }

  static generateSalt(): string | number {
    return bcrypt.genSaltSync(10);
  }

  //generate token
  static generateToken (user: {_id: string, name: string, email: string, phone: string, isConfirmed: boolean}) {
    return process.env.SECRET && jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        
        phone: user.phone,
        isConfirmed: user.isConfirmed
      },
      process.env.SECRET, { expiresIn: 100 * 60 * 60 }
    );
  }
}

export default UserController;