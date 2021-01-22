import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import request from 'request';
import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const client = twilio(accountSid, authToken,  { 
  lazyLoading: true 
}); 





import Schema from '../schema/schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

const Flutterwave = require('flutterwave-node-v3');
const rave = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);



//date initialization
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year


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
  static async signup (request: Request, response: Response) {
    const {
      fullname, email, password, phone, cpassword, country
    } = request.body;

    console.log(request.body);




    try {
    
  
      const foundEmail = await Schema.User().find({phone: phone.trim()});
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
  
      const confirmationCode = String(Date.now()).slice(9, 13);
      const message = `Verification code: ${confirmationCode}`
      //UserController.sendMail(email.trim(), message)
      client.messages 
      .create({ 
         body: message, 
         from: '+17076402854',       
         to: phone 
       }) 
      .then(response => console.log(response.sid)) 
      
      await Schema.User().create({
        name: fullname.trim(),
        country: country,
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
      phone
    } = request.body;
    console.log(phone)

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.User()
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
      phone
    } = request.body;
  
    const user = await Schema.User().findOne({phone: phone.trim()});
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
     // UserController.sendMail(user.email, message, 'Password change');
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
      phone
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
    const user = await Schema.User().findOne({phone: phone.trim()});
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

    const foundUser:any = await Schema.User().findOne({phone: phone.trim()});

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
      phone, confirmationCode
    } = request.body;

    const foundUser:any = await Schema.User().findOne({phone});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (foundUser.confirmationCode !== confirmationCode) {
        return response.status(403).send({
          message: 'Incorrect confirmation code'
        });
      }
      try {
        const dt = new Date();
        const createdAt = dt.toLocaleDateString();
        console.log(createdAt)
        var now = new Date();
        
        //after 7 days
            const promo =  now.setDate(now.getDate()+7);
      console.log(now.toLocaleDateString())

        await Schema.User().updateOne({
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

  static async userDetails(request: Request, response: Response){

    const {uid} = request.params;
    console.log(uid)

    try {
      const user = await Schema.User().findOne({_id: uid});
      console.log(user)
      if (user && Object.keys(user).length) {
        response.status(200).send({
          user
        });
        console.log(user)
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
      const user = await Schema.User().findOne({_id: uid});
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
      await Schema.User()
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



  //get users
  static async Users(request: Request, response: Response) {


    try {
      const users = await Schema.User().find({}).sort({'_id': -1})  
      console.log(users)
      return response.status(200).send({value: users})
    } catch(error) {
        console.log(error.toString());
    return  response.status(500).send({
        message: 'something went wrong'
      });
    }
  }






//******PLATABOX WALLET */

//FUND ACCOUNT
static async fundWallet(request: Request, response: Response){
  const{amount, uid} = request.body;
  console.log(amount)
  console.log(uid)


    try {

  const user = await Schema.User().findOne({_id: uid});
  console.log(user);

  const new_amount = parseInt(user.balance) + parseInt(amount)
  console.log("new amount " + new_amount)

  if(user){
    //update amount
    await Schema.User()
    .updateOne({
      _id: uid,
    }, {
    $set: {
      balance: new_amount,
    }
  });

  await Schema.Transaction().create({
    user: uid,
    amount: amount,
    status: 'funded',
    date: today
  })

  return  response.status(200).send({
    message: 'Account Funded!'
  });

} else {
  console.log('User not found')
  return  response.status(500).send({
    message: 'User not found'
  });
  
}

} catch(err){
  console.log(err)
  return  response.status(500).send({
    message: 'An error occured'
  });
}



}


//WITHDRAW FUNDS
static async withdrawFund(req: Request, response: Response){
  const {uid, bcode, amount, anumber} =  req.body;
  

  //check balance in platabox account
  
  var options = {
    'method': 'GET',
    'url': 'https://api.flutterwave.com/v3/balances/NGN',
    'headers': {
      'Authorization': `Bearer ${process.env.SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  };



  request(options, async (error, resp) => { 
    if(error){
      console.log(error)
    };
  
    console.log(  parseInt(resp.body.split(":")[5].split(",")[0]))
    var balance =  parseInt(resp.body.split(":")[5].split(",")[0])
   
  try {
  const user = await Schema.User().findOne({_id: uid});
  const admin = await Schema.User().findOne({name: 'mustafa mohammed'})
  console.log(user);
  const new_amount = parseInt(user.balance) - parseInt(amount)
  const limit = parseInt(user.balance) - 50
  console.log(limit)

  if(user){
    //check if amount the amount is greatr than the limit
    if(anumber.length > 10 || anumber.length < 10){
      return response.send({message: "Account number should be 10 digits"})
  }
    if(amount > limit){
      return response.send({message: `The specified amount is more than your withdrawal limit: ${limit}`})
  }
  if(balance < amount){
    if(admin){

      //notify admin
     let chunks = expo.chunkPushNotifications([{
       "to": admin.pushToken,
       "sound": "default",
       "channelId": "notification-sound-channel",
       "title": "Transfer Request!",
       "body": `Please attend to the transfer request ASAP!.`
     }]);
     let tickets = [];
     (async () => {
       for (let chunk of chunks) {
         try {
           let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
           console.log(ticketChunk);
           tickets.push(...ticketChunk);
        
         } catch (error) {
           console.error(error);
         }
       }
     })();
       
         }
    return response.status(400).send({message: 'Service is busy at the moment due to high number of requests. Please try again in a few minute :)'})
    }
 

 
    else {
    const payload = {
      "account_bank": bcode,
      "account_number": anumber,
      "amount": amount,
      "narration": `Platabox Wallet Withdrawal of ${amount}`,
      "currency": "NGN",
      "debit_currency": "NGN",
      "reference":"pbwd-"+ Date.now()
  }
  const resp = await rave.Transfer.initiate(payload)
  console.log(resp)
  if(resp.data.fullname === 'N/A'){
    console.log('Invalid account number')
    return response.send({
      message: 'Invalid account number'
    });
  }  
  if(resp.data.status === 'FAILED'){
    console.log('transaction failed. Please try again later')
    return response.send({
      message: 'Transaction failed. Please check your account details and try again'
    });
  }

  if(resp.data.status === 'NEW'){
    console.log('Transaction Successful')
    // if successful
    // send success message

    //remove amount
  await Schema.User()
  .updateOne({
_id: uid,
}, {
$set: {
balance: new_amount,
}
   });

  await Schema.Transaction().create({
  user: uid,
  amount: amount,
  status: 'withdraw',
  date: today
  })

  console.log('new amount ' + new_amount)

  return response.send({
    message: 'Transaction Successful'
  });
  }

 
  }  
}  else {
  return response.send({message: "User not found"})
  
}
  } catch(error) {
      console.log(error)
      return response.status(401).send({
        message: 'Something went wrong. please try again'
      });
  }

});
}


//MANUALLY TRANSFER FUNDS THROUGH BANK TRANSFER
//SAVE THE TRANSFER REQUESTS HERE
static async transferRequests(req: Request, response: Response){
  const{amount, uid, anumber, bank} = req.body;
  console.log(bank)
  console.log(anumber)
  console.log(uid)

  //check balance in platabox account


    var options = {
      'method': 'GET',
      'url': 'https://api.flutterwave.com/v3/balances/NGN',
      'headers': {
        'Authorization': `Bearer ${process.env.SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    request(options, async (error, resp) => { 
      if(error){
        console.log(error)
      };
    
      console.log(parseInt(resp.body.split(":")[5].split(",")[0]))
      var balance =  parseInt(resp.body.split(":")[5].split(",")[0])

    try {
      const user = await Schema.User().findOne({_id: uid});
      const admin = await Schema.User().findOne({name: 'mustafa mohammed'})
      console.log(user);
      console.log(admin)
      const limit = parseInt(user.balance) - 50

    if(user){
      //SAVE THE TRANSFER REQUEST
      if(anumber.length > 10 || anumber.length < 10){
        return response.send({message: "Account number should be 10 digits"})
    }
      if(amount > limit){
        return response.send({message: `The specified amount is more than your withdrawal limit: ${limit}`})
    }

    if(balance < amount){
      if(admin){

        //notify admin
       let chunks = expo.chunkPushNotifications([{
         "to": admin.pushToken,
         "sound": "default",
         "channelId": "notification-sound-channel",
         "title": "Transfer Request!",
         "body": `Please attend to the transfer request ASAP!.`
       }]);
       let tickets = [];
       (async () => {
         for (let chunk of chunks) {
           try {
             let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
             console.log(ticketChunk);
             tickets.push(...ticketChunk);
          
           } catch (error) {
             console.error(error);
           }
         }
       })();
         
           }
      return response.status(400).send({message: 'Service is busy at the moment due to high number of requests. Please try again in a few minute :)'})
      }
    
  
    await Schema.Transfers().create({
      user: uid,
      amount: amount,
      anumber: anumber,
      bank: bank,
      date: today
    })

    if(admin){

 //notify admin
let chunks = expo.chunkPushNotifications([{
  "to": admin.pushToken,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Transfer Request!",
  "body": `Please attend to the transfer request ASAP!.`
}]);
let tickets = [];
(async () => {
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
   
    } catch (error) {
      console.error(error);
    }
  }
})();
  
    }
    return response.status(200).send({
      message: 'Transfer Request Funded!'
    });
  } else {
    console.log('User not found')
    return  response.status(500).send({
      message: 'User not found'
    });
    
  }

  }catch(err){
    console.log(err)
    return  response.status(500).send({
      message: 'An error occured'
    });
  }

  
});
  

}

//UPDATE A TRANSFER REQUEST
static async updateTransfer(request: Request, response: Response){
  const{amount, uid} = request.body;
  console.log(amount)
  console.log(uid)


  
    try {
      const user = await Schema.User().findOne({_id: uid});
      console.log(user);
    
      const new_amount = user.balance - amount
      console.log("new amount " + new_amount)
      if(user){
        //update amount
    await Schema.User()
    .updateOne({
      _id: uid,
    }, {
    $set: {
      balance: new_amount,
    }
  });

  await Schema.Transaction().create({
    user: uid,
    amount: amount,
    status: 'withdraw',
    date: today
  })

  return  response.status(200).send({
    message: 'Re-Funded!'
  });
} else {
  console.log('User not found')
  return  response.status(500).send({
    message: 'User not found'
  });
  
}

} catch(err){
  console.log(err)
  return  response.status(500).send({
    message: 'An error occured'
  });
}

 

}

//GET TRANSACTIONS
static async allTrans(request: Request, response: Response){
  const{uid} = request.body;


  try {
    
    const user = await Schema.User().findOne({_id: uid})
    console.log(user)
    const trans = await Schema.Transaction().find({user:uid}).sort({'_id': -1})  
    console.log(trans)
    if(user && trans){
      response.status(200).send({trans: trans})
    } else {
      response.status(500).send({error: 'Could not find Transactions for this user'})
    }

  } catch(error) {
    console.log(error)
    response.status(500).send('Something went wrong')

  }
}


//GET ALL TRANS
//GET TRANSACTIONS
static async getTrans(request: Request, response: Response){

  try {
    
    const trans = await Schema.Transaction().find().sort({'_id': -1})  
    console.log(trans)
    if(trans){
      response.status(200).send({trans: trans})
    } else {
      response.status(500).send({error: 'Could not find Transactions for this user'})
    }

  } catch(error) {
    console.log(error)
    response.status(500).send('Something went wrong')

  }
}





}





export default UserController;
