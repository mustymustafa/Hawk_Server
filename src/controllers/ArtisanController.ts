import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken,  { 
  lazyLoading: true 
}); 

import { Expo } from "expo-server-sdk";

const expo = new Expo();



import Schema from '../schema/schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";
import { create } from 'domain';

/** 
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });
*/

 function addWeek(date: any, week: any) {
   console.log(date)
  const d = date.getDate();

  date.setDate(date.getDate() + +week);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  console.log(date)
  return date;
}

class ArtisanController {


    // sign up
  static async signup (request: Request, response: Response) {
    const {
      fullname, email, password, phone, cpassword
    } = request.body;

    console.log(phone);

    try {
      const foundEmail = await Schema.Artisan().find({phone: phone.trim()});
      if (foundEmail && foundEmail.length > 0) {

        console.log(foundEmail[0])
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
email, bio, wage, category, vl_expiry, id_expiry, vcolor, vmodel, plate, sname, sphone
    } = request.body;

    console.log(request.body);
    const foundUser:any = await Schema.Artisan().findOne({email});

    if (foundUser && Object.keys(foundUser).length > 0) {
        console.log(foundUser);
        try {
          const dt = new Date();
          const createdAt = dt.toLocaleDateString();
          console.log(createdAt)
          var now = new Date();
          
          //after 7 days
              const expire =  now.setDate(now.getDate()+7);
        console.log(now.toLocaleDateString())
    

  await Schema.Artisan().updateOne({
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
                plate: plate,
                sname: sname,
                sphone: sphone,
                createdAt: createdAt,
                expireAt: now.toLocaleDateString()
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



    //update profile
    static async updateArtisan (request: Request, response: Response) {
      
      const {
  uid, bio, wage, phone, name
      } = request.body;
  
      console.log(request.body);
      const foundUser:any = await Schema.Artisan().findOne({_id: uid});

      if (foundUser && Object.keys(foundUser).length > 0) {
          console.log(foundUser);
          if (!bio) {
       
            return response.status(409).send({
              message: 'Please enter a bio',
            });
          }

          if(!( (/^[a-z][a-z]+\s[a-z][a-z]+$/.test(name.trim())) || (/^[A-Z][a-z]+\s[a-z][a-z]+$/.test(name.trim())) || (/^[a-z][a-z]+\s[A-Z][a-z]+$/.test(name.trim())) || (/^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(name.trim())) )  ){
     
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
              await Schema.Artisan().updateOne({
                _id: uid
              }, {
                $set: {
                  bio: bio,
                  wage: wage,
                  phone: phone,
                  name: name

                }
              });
      
              
              return   response.status(200).send({
                  message: 'User updated successfully',
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
  
  //update artisan location




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

static uploadVl(req: Request, res: Response) {
  const parts = req.file.originalname.split(' ')
  const find = parts[0]
  console.log(find)
  res.json(req.file)
}

static uploadIns(req: Request, res: Response) {
  const parts = req.file.originalname.split(' ')
  const find = parts[0]
  console.log(find)
  res.json(req.file)
}

static uploadPoo(req: Request, res: Response) {
  const parts = req.file.originalname.split(' ')
  const find = parts[0]
  console.log(find)
  res.json(req.file)
}

static uploadVir(req: Request, res: Response) {
  const parts = req.file.originalname.split(' ')
  const find = parts[0]
  console.log(find)
  res.json(req.file)
}

static uploadVpic(req: Request, res: Response) {
  const parts = req.file.originalname.split(' ')
  const find = parts[0]
  console.log(find)
  res.json(req.file)
}

static uploadCert(req: Request, res: Response) {
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
       
  static async setCert( request: Request, res: Response) {
     
  
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
                                          cert: image
                                         
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
                      
  static async setVl( request: Request, res: Response) {
     
  
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
                                                    vl: image
                                                   
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
   static async setIns( request: Request, res: Response) {
     
  
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
                                                              insurance: image
                                                             
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
                                          
  static async setPoo( request: Request, res: Response) {
     
  
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
                                                                        poo: image
                                                                       
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
                                                    
 static async setVir( request: Request, res: Response) {
     
  
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
                                vir: image
                               
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
            
   static async setVpic( request: Request, res: Response) {
     
  
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
                                          vpic: image
                                         
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
         
                                                                                                                  
            //set id_expiry
            static async idExpiry (request: Request, response: Response) {
      
              const {
          email,  id_expiry,
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
                          id_expiry: id_expiry,
                        
                        }
                      });
              
                      
                      return   response.status(200).send({
                          message: 'User updated successfully',
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
          
  //set vehicle details
   //continue signup
   static async vehicleDetails (request: Request, response: Response) {
      
    const {
email, phone,  vl_expiry, vcolor, vmodel, plate, sname, sphone
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
                vl_expiry: vl_expiry,
                vcolor: vcolor,
                vmodel: vmodel,
                plate: plate,
                sname: sname,
                sphone: sphone
              }
            });
    
            
            return   response.status(200).send({
                message: 'User updated successfully',
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



















  //send otp
  static async sendOtp(request: Request, response: Response) {
    const {
      phone
    } = request.body;

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.Artisan()
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
     .then(response => console.log(response.sid))  
     response.status(200).send({
        message: 'Please check your phone for token'
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
     //ArtisanController.sendMail(user.email, message, 'Password change');
     client.messages 
     .create({ 
        body: message, 
        from: '+17076402854',       
        to: user.phone 
      }) 
     .then(response => console.log(response.sid))  
     response.status(200).send({
        message: 'Please check your phone for token'
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
  static async signin (request: Request, response: Response) {
    const {
      phone, password
    } = request.body;
    console.log(phone)
    const foundUser:any = await Schema.Artisan().findOne({phone: phone.trim()});

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
            active: true
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
    var amount = 0;

    const {uid} = request.params;
    console.log(uid)

    try {
      const user = await Schema.Artisan().findOne({_id: uid});
      //console.log(user)
      if (user && Object.keys(user).length) {

        //get Rating
         const getRating = user.rating
    console.log(getRating.length);

    //get Earnings
    const getEarnings = user.earnings;
    console.log(getEarnings);


        // get rate
    for(var i = 0; i < getRating.length; i++){
        total += getRating[i]
    }
    var rate = Math.round(total / getRating.length);
    console.log("rating:" + rate)


      //get total amount
      for(var i = 0; i < getEarnings.length; i++){
        amount += getEarnings[i]
    }
    console.log('amount:' + amount)
        //amount to pay
        var pay = Math.round(amount * 0.1);
        console.log('pay' + pay)


    response.status(200).send({
      user,
      rating: rate,
      earning: amount,
      pay: pay

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

  //update status on payment
  static async activateAccount(request: Request, response: Response){
    const {uid} = request.params
    //const expire =  addWeek(new Date(), 1).toLocaleDateString();
    var now = new Date();
          
    //after 7 days
        const expire =  now.setDate(now.getDate()+7);
  console.log(now.toLocaleDateString())

    

    try{
      const user =  await Schema.Artisan().findOne({_id: uid})
      if(user){

       await Schema.Artisan().updateOne({_id: uid},
          {
            $set: {
              active: true,
              expireAt: now.toLocaleDateString()
            }
          }
             
           )

           user.earnings.splice(0, user.earnings.length)

           response.status(200).send({
             message: 'Account Activated!'
           })

      } else {
        response.status(404).send({
          message: 'Cannot find details for this user'
        });
      }

    } catch(error){
      response.status(404).send({error: 'could not complete your request at the moment' })
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

  //update lat and long while moving
  static async updateLocation(request: Request, response: Response){
    const {lat, long} = request.body;
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
          _id: uid,
        }, {
        $set: {
          lat: lat,
          long: long
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


  //get artisan  lat and long
  static async artisanLoc(request: Request, response: Response){

    const {uid} = request.params;
    //console.log("uid" + uid)

    try {
      const user = await Schema.Artisan().findOne({_id: uid});
      //console.log(user)
      if (user) {

        response.status(200).send({
          lat: user.lat,
          long: user.long
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


  //get all drivers
  static async getDrivers(request: Request, response: Response){

    

    try {
      const user = await Schema.Artisan().find({category: 'driver'});
     

      if (user) {
   
          console.log(user)
          return response.status(200).send({user});
 
        


  

 
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
