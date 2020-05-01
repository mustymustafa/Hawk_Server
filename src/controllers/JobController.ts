import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";



import Schema from '../schema/Schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";
import { Expo } from "expo-server-sdk";
import { isArray } from 'util';
const expo = new Expo();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });



 class JobController {


  static async createJob (request:Request, response:Response){
    const {category, uid, location, description} = request.body;
    let savedTokens;


    try {
        const user = await Schema.User().findById({_id: uid})
        .populate({path: 'user', model: Schema.Job(), select: ['name', 'phone'] })

        console.log(user);


        /** 
               const artisan = await Schema.Artisan().find({category: category});
      const artis = artisan.map(art => {
        return art.pushToken
      })

      savedTokens = artis;
      
      console.log(artis)
      if (!artisan) {
        return response.status(404).send({
          message: 'No artisans found'
        });
      }
     
      


      //send notification
  
      let chunks = expo.chunkPushNotifications([{
        "to": savedTokens,
        "sound": "default",
        "title": "Job Request",
        "body": "A Mechanic is needed."
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

      

      
  
 
      
     return response.status(200).send("job requested");
*/

    } catch(error){
      console.log(error)
    }


  }



 }



 export default JobController;