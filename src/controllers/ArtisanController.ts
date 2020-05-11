import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import { Expo } from "expo-server-sdk";

const expo = new Expo();



import Schema from '../schema/schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });

class ArtisanController {


    // sign up
  static async signup (request: Request, response: Response) {
    const {
      fullname, email, password, phone, cpassword
    } = request.body;

    console.log(request.body);

    try {
      const foundEmail = await Schema.Artisan().find({email: email.trim()});
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


      
      await Schema.Artisan().create({
        name: fullname.trim(),
        email: email.trim(),
        password: bcrypt.hashSync(password.trim(),ArtisanController.generateSalt()),
        phone,
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

  //continue signup
  static async continueSignup (request: Request, response: Response) {
      
    const {
email, bio, wage, category,
    } = request.body;

    console.log(request.body);
    const foundUser:any = await Schema.Artisan().findOne({email});

    if (foundUser && Object.keys(foundUser).length > 0) {
        console.log(foundUser);
        try {
            await Schema.Artisan().updateOne({
              _id: foundUser._id
            }, {
              $set: {
                bio: bio,
                wage: wage,
                category: category
              }
            });
    
            
            return   response.status(200).send({
                message: 'User created successfully',
                status: 201
              });
          } catch (error) {
            console.log(error.toString());
            response.status(500).send({
              message: 'something went wrong'
            });
          }
        }


    }




  //upload images
    static uploadimage(req: Request, res: Response) {
        const parts = req.file.originalname.split(' ')
        const find = parts[0]
        console.log(find)
        res.json(req.file)
  }

  static uploadDp(req: Request, res: Response) {
    const parts = req.file.originalname.split(' ')
    const find = parts[0]
    console.log(find)
    res.json(req.file)
}

//set images
static async setId( request: Request, res: Response) {
     
  
    console.log(request.body)
        try {
         const email = request.body.email
         const image = request.body.image
           console.log(email)
           console.log(image)
        
        
         

        const foundUser:any = await Schema.Artisan().findOne({email});
    
        if (foundUser && Object.keys(foundUser).length > 0) {
            console.log(foundUser);
         
                await Schema.Artisan().updateOne({
                  _id: foundUser._id
                }, {
                  $set: {
                    idCard: image
                   
                  }
                });
    
                
                return  res.status(200).send("image set")
                } 
              } catch (error) {
                console.log(error.toString());
                res.status(500).send({
                  message: 'something went wrong'
                });
              }
        
    



            }


            static async setDp( request: Request, res: Response) {
     
  
                console.log(request.body)
                    try {
                     const email = request.body.email
                     const image = request.body.image
                       console.log(email)
                       console.log(image)
                    
                    
                     
            
                    const foundUser:any = await Schema.Artisan().findOne({email});
                
                    if (foundUser && Object.keys(foundUser).length > 0) {
                        console.log(foundUser);
                     
                            await Schema.Artisan().updateOne({
                              _id: foundUser._id
                            }, {
                              $set: {
                                pic: image
                               
                              }
                            });
                
                            
                            return  res.status(200).send("image set")
                            } 
                          } catch (error) {
                            console.log(error.toString());
                            res.status(500).send({
                              message: 'something went wrong'
                            });
                          }
                    
                
            
            
            
                        }
            
            
            





  //send otp
  static async sendOtp(request: Request, response: Response) {
    const {
      email
    } = request.body;

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.Artisan()
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
    const user = await Schema.Artisan().findOne({email: email.trim()});
    if (!user) {
      return response.status(404).send({
        message: 'User does not exist'
      });
    }

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.Artisan()
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
    const user = await Schema.Artisan().findOne({email: email.trim()});
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
      await Schema.Artisan()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          password: bcrypt.hashSync(password.trim(),ArtisanController.generateSalt()),
        }
      });
      return response.status(200).send({
        token:ArtisanController.generateToken(user)
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

    const foundUser:any = await Schema.Artisan().findOne({email: email.trim()});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (!bcrypt.compareSync(password, foundUser.password)) {
        return response.status(403).send({
          message: 'Incorrect Password'
        });
      }
      return response.status(200).send({
        token:ArtisanController.generateToken(foundUser)
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

    const foundUser:any = await Schema.Artisan().findOne({email: email.trim()});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (!bcrypt.compareSync(password, foundUser.password)) {
        return response.status(403).send({
          message: 'Incorrect Password'
        });
      }
      return response.status(200).send({
        token:ArtisanController.generateToken(foundUser)
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
    console.log(confirmationCode)

    const foundUser:any = await Schema.Artisan().findOne({email});
    console.log(foundUser.confirmationCode)

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (foundUser.confirmationCode !== confirmationCode) {
        return response.status(403).send({
          message: 'Incorrect confirmation code'
        });
      }
      try {
        await Schema.Artisan().updateOne({
          _id: foundUser._id
        }, {
          $set: {
            isConfirmed: true,
          }
        });

        foundUser.isConfirmed = true;
        return response.status(200).send({
          token:ArtisanController.generateToken(foundUser)
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

  //GET USER DETAILS

  static async userDetails(request: Request, response: Response){
     
    var total = 0;

    const {uid} = request.params;
    console.log(uid)

    try {
      const user = await Schema.Artisan().findOne({_id: uid});
      //console.log(user)
      if (user && Object.keys(user).length) {

         const getRating = user.rating
    console.log(getRating.length);

    for(var i = 0; i < getRating.length; i++){
        total += getRating[i]
    }
    var rate = Math.round(total / getRating.length);
    console.log("rating:" + rate)

        response.status(200).send({
          user,
          rating: rate
        });
       // console.log(user)
      } else {
        response.status(404).send({
          message: 'Cannot find details for this user'
        });
        console.log("not found")
      }
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  }


  //location
  static async storeLocation(request: Request, response: Response){
    const {lat, long, location, area1, area2} = request.body;
    const {uid} = request.params;

    const user = await Schema.Artisan().findOne({_id: uid});
    if (!user) {
      return response.status(404).send({
        message: 'User does not exist'
      });
    }
 
    try {
      await Schema.Artisan()
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
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }


  } 

  static async savePushToken(request: Request, response: Response){

    const {uid} = request.params;
    const token = request.body.token

    console.log(token)

    //check token
    if(!Expo.isExpoPushToken(token)){
      console.log("invalid token")
      return response.status(404).send({
        message: "invalid token"
      })

    }

   
 
    try {
      const user = await Schema.Artisan().findOne({_id: uid});
      if (!user) {
        return response.status(404).send({
          message: 'User does not exist'
        });
      }
      if(user.pushToken === token){
        console.log("token exists already")
        return response.status(404).send({
          message: 'token exists already'
        });
      }
      await Schema.Artisan()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          pushToken: token,
        }
      });
      return response.status(200).send("token saved");
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }


}

export default ArtisanController;
