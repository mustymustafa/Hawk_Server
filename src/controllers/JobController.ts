import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";



import Schema from '../schema/Schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";
import { Expo } from "expo-server-sdk";

import mongoose from 'mongoose';
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
            rated: false,
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
      console.log(category);
      console.log("area1:" + area1);
      console.log("area2:" + area2);
      
      // find artisan
    const job = await Schema.Job().find({category: category,  $or:[{area1: area1}, {area2: area2}], $and: [{status: 'active'}]})

    console.log(job)
    return response.status(200).send({job})

  }


  static async acceptJob(request:Request, response:Response){

    const {uid, job_id, price} = request.body
    console.log("uid" + uid, "job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

    
    if (!job && !hirer) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   
    try {
        await Schema.Job().updateOne({
            _id: job_id
        },
        {
            $set: {
                artisan: uid,
                status: 'accepted',
                price: price
            }
        }
        );


       return response.status(200).send({hirer: hirer.name, number: hirer.phone})
       




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }

  static async cancelJob(request:Request, response:Response){

    const {uid, job_id} = request.body
    console.log("job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)
       


    
    if (!job && !hirer) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   
    try {
        await Schema.Job().deleteOne({_id: job_id});

        console.log("deleted");
        response.status(201).send({
            message: 'Task Cancelled successfully',
            status: 201
          });
       




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }

  static async completeJob(request:Request, response:Response){

    const {job_id,} = request.body
    console.log( "job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       
    
    if (!job) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   
    try {
        await Schema.Job().findByIdAndUpdate({
            _id: job_id
        },
        {
            $set: {
                status: 'completed'
            }
        }
        );


       return response.status(201).send({
           message: "Completed",
           status: 201
       })
       




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }

  


  static async artisanJobs(request:Request, response:Response) {
    const {uid} = request.body; 
    console.log("artisan:" + uid);
    
    
    // find artisan and hirer
    try {

    
  const job = await Schema.Job().find({artisan: uid, $and:[{status: 'accepted'}]})

  console.log(job)

  //get hirer id
  const user = job.map(usr => {
      return usr.user
  })

  const hirer = await Schema.User().findOne({_id: user});
  console.log("hirer:" + hirer)

  return response.status(200).send(
      {
          job: job,
          hirer: hirer
      }
  )
    } catch (error) {
        console.log(error)
        return response.status(404).send("An error occured")
    }
}

//get artisan
static async getArtisan(request:Request, response:Response) {
    const {uid, name} = request.body; 

    console.log("category" + name);
    console.log("user:" + uid);
    
    // find artisan
  const job = await Schema.Job().find({user: uid,  $and: [{category: name}]}).where('status').equals('accepted')
  //get artisan id
  const getId = job.map(art => {
      return art.artisan
  })

 
  const findArtisan = await Schema.Artisan().find({_id: getId})
  console.log(findArtisan)

  if(!findArtisan){
      console.log("No Artisan Available")
      return response.status(400).send({notFound: "No Artisan is available at the moment"})

  }

try {


  const artisan = findArtisan.map(artis => {
 
  
    const jb = job.map(get => {

        console.log(artis)
        return response.status(200).send({artisan: artis, job: get})
      
    })

  })
  
} catch(error) {

    console.log(error);
    response.status(404).send("something went wrong")

}


 

}


// Job Rating

static async checkRating(request: Request, response: Response){
    const {uid} = request.body;
    console.log("user:" + uid)


    const job =  await Schema.Job().findOne({user: uid}).where('rated').equals(false).where('status').equals('completed')
    console.log(job);

    const artisan = await Schema.Artisan().findOne({_id: job.artisan});
    try {
        if(job && artisan){
            return response.status(201).send({
                job: job,
                artisan: artisan
            })
        }
        

    } catch(error) {
        console.log(error)
        return response.status(400).send({
            message: "error"
        })
    }
   
 
    
}


static async rateArtisan(request: Request, response: Response){
    const { uid, rate, comment} = request.body;
    console.log("user:" + uid)
    
    if (!rate || rate < 0 || rate > 10) {
       
        return response.status(409).send({
          message: 'Please enter a valid number between 0-10',
        });
      }

    const job =  await Schema.Job().findOne({user: uid}).where('rated').equals(false).where('status').equals('completed')


    const artisan = await Schema.Artisan().findOne({_id: job.artisan});
    if(job && artisan){
        console.log("job:" + job._id)
        await Schema.Artisan().updateOne({
            _id: artisan._id
        },
        {
            $push: {
                rating: rate,
                comments: comment
            }
        }
        )

    try {
       
         
            await Schema.Job().findByIdAndUpdate({
                _id: job._id
            },
            {
                $set: {
                    rated: "true"
                }
            }
            );
       
            
            return response.status(201).send({
                message: "Artisan rated"
            })

        } catch(error) {
        console.log(error)
        return response.status(400).send({
            message: "error"
        })
    }


    }
   
 
    
}






 }



 export default JobController;