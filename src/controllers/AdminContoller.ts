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

import Schema from '../schema/schema';
import { Expo } from "expo-server-sdk";

const expo = new Expo();

const Flutterwave = require('flutterwave-node-v3');
const rave = new Flutterwave(process.env.PUBLICK_KEY, process.env.SECRET_KEY, false);


class AdminController {

    //send  user notifcation
    static async userNotification (request:Request, response:Response){
        const {title, body} = request.body;

    const get_users = await Schema.User().find({pushToken: {$exists: true} })
    console.log("users:" + get_users)
  
    get_users.map(users => {
   
      console.log("tokens:" + users.pushToken)
      let chunks = expo.chunkPushNotifications([{
        "to": [users.pushToken],
        "sound": "default",
        "title": `${title}`,
        "body": `${body}`
      }]);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            //response.send({message:'Sent'})
         
          } catch (error) {
            console.error(error);
            response.send({message:'error'})
          }
        }
      })();
      })
    

 

    }

    //send driver notification
    static async driverNotification (request:Request, response:Response){
        const {title, body} = request.body;
        console.log(title)

    const get_users = await Schema.Artisan().find({pushToken: {$exists: true} })
    console.log("users:" + get_users)
  
    get_users.map(users => {
   
      console.log("tokens:" + users.pushToken)
      let chunks = expo.chunkPushNotifications([{
        "to": [users.pushToken],
        "sound": "default",
        "title": `${title}`,
        "body": `${body}`
      }]);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
            //response.send({message:'Sent'})
         
          } catch (error) {
            console.error(error);
            response.send({message:'error'})
          }
        }
      })();
      })
    



    }

    //send Text messsge to user
    static async userText (request:Request, response:Response){
        const {uid, title, body} = request.body;

 
  
    try {
        const user = await Schema.User().findOne({_id: uid })
        console.log("user:" + user)
        if(user && user.phone.length > 0 && user.phone !== undefined){
            client.messages
                .create({
                  body: `${body}`,
                  from: '+17076402854',
                  to: user.phone
                });
                response.send({message: "sent"})
              } else {
                response.send({message: "User or number not found"})
              }
            
            } catch (error) {
                console.log(error.toString());
              }
    }

      //send Text messsge to user
      static async driverText (request:Request, response:Response){
        const {uid, title, body} = request.body;

 
  
    try {
        const user = await Schema.Artisan().findOne({_id: uid })
        console.log("user:" + user)
        if(user && user.phone.length > 0 && user.phone !== undefined){
            client.messages
                .create({
                  body: `${body}`,
                  from: '+17076402854',
                  to: user.phone
                });
                response.send({message: "sent"})
              } else {
                response.send({message: "User or number not found"})
              }
            
            } catch (error) {
                console.log(error.toString());
              }
    }

    

    



    //Statistics
    static async statistics (request:Request, response:Response){


        try{
        
            //get all log requests
            const logs = await Schema.Job().find({category: 'log'});
            console.log("all logs " + logs.length)

            //get all completed log requests
            const comlogs = await Schema.Job().find({category: 'log'}).where({status: 'completed'})
            console.log("completed logs " + comlogs.length)

             //get all cancelled log requests
             const canlogs = await Schema.Job().find({category: 'log'}).where({status: 'cancelled'})
             console.log("cancelled logs " + canlogs.length)

                 //get all wallet amount
                 const get_users = await Schema.User().find({balance: {$exists: true}})
                 //Get driver's details
                const get_drivers = await Schema.Artisan().find({category: 'log',  earnings: {$exists: true}, cash: {$exists: true}, total_funds: {$exists: true}})

                const driver_earnings =   get_drivers.map(driver => {
                  return driver.earnings
                     })

                 const users_balance =  get_users.map(users => {
                     return users.balance
                }) 

                const earnings = driver_earnings.reduce((a,b) => a + b, 0)
                //console.log("total wallet earnings for drivers" + driver);
                console.log("total wallet earnings for drivers " + earnings);

                const driver_cash =   get_drivers.map(driver => {
                    return driver.cash
                       })
                const cash = driver_cash.reduce((a,b) => a + b, 0)
                console.log("total cash made for drivers " + cash);

                const driver_funds =   get_drivers.map(driver => {
                    return driver.total_funds
                       })
                const all_funds = driver_funds.reduce((a,b) => a + b, 0)
                console.log("total driver funds " + all_funds);

                //get platabox cash from 15%
                const total_cash = cash * 0.15
                console.log("Platabox cash " + total_cash);

                 //get platabox wallet from 15%
                 const total_wallet = earnings * 0.15
                 console.log("Platabox wallet " + total_wallet);

                 const total = total_cash + total_wallet
                 console.log('Platabox Total ' + total)

                 const wallet = users_balance.reduce((a,b) => a + b, 0)
                 console.log("Total User's wallet " + wallet);

                 response.send({logs: logs.length, comlogs: comlogs.length, canlogs: canlogs.length, earnings: earnings, cash: cash, all_funds: all_funds, total_cash: total_cash, total_wallet: total_wallet, pb_total: total, user_wallet: wallet})

    






      
            
   




        } catch (error){
            console.log(error)
        }

    }
 




}

export default AdminController;