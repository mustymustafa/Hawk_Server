import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import request from 'request';
import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, {
  lazyLoading: true
});

import { Expo } from "expo-server-sdk";

const expo = new Expo();

const Flutterwave = require('flutterwave-node-v3');
const rave = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);


class PaymentController{


  static async verifyAccount (req: Request, response: Response) {
    const {anumber, bcode} = req.body;
    var options = {
      'method': 'POST',
      'url': 'https://api.flutterwave.com/v3/accounts/resolve',
      'headers': {
        'Authorization': `Bearer ${process.env.SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify({
        "account_number": `${anumber}`,
        "account_bank": `${bcode}`
      })
    };
  
    request(options, async (error, resp) => { 
      if(error){
        console.log(error)
        response.status(409).send({message: 'An error occured'})
      };
      console.log(resp.body.split(":")[5].split(",")[0].replace('}}', ""))
      const name = resp.body.split(":")[5].split(",")[0].replace('}}', "")
      response.status(200).send({message: name})

    })

  }

}

export default PaymentController;