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
    const {category, uid, location, description, area1, area2} = request.body;
    console.log(category, uid,location, description)
    console.log("area1:" + area1);
    console.log("area2:" + area2);
    

    let savedTokens;


    try {
        if(!description){
            console.log("no desc")
            return  response.status(409).send({
                message: 'Please enter a description',
              });
        } 
        if(!location){
            console.log("no loc")
            return  response.status(409).send({
                message: 'Please enter a location',
              });
        } 
       
                 //find user{}
//                 const user = await Schema.User().findById({_id: uid})
  //               .populate({path: 'user', model: Schema.Job() }).exec()
     
       // console.log(user);

        //create job
        const dt = new Date()
        const now = dt.setMinutes( dt.getMinutes());
        const createdAt = dt.toLocaleDateString()
        const endAt =  dt.setMinutes( dt.getMinutes() + 30 );
        console.log(createdAt)
        console.log("end:" + endAt)
        console.log("now:" + now)

        await Schema.Job().create({
            user: uid,
            category: category,
            location: location,
            description: description,
            status: 'active',
            area1: area1,
            area2: area2,
            createdAt: createdAt,
            endAt: endAt,
            now: now,
            active: true

        })
 
        response.status(201).send({
            message: 'Job created successfully',
            status: 201
          });



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
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong"
        })
    }


  }

  static async displayJobs(request:Request, response:Response) {
      const {category, area1, area2} = request.body; 
      // find artisan
    const job = await Schema.Job().find({category: category,  $or:[{area1: area1}, {area2: area2}]})

    console.log(job)

  }



 }



 export default JobController;