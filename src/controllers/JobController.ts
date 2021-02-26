import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import Schema from '../schema/schema';
import Validator from '../validator/Validator';

import nodemailer from "nodemailer";
import { Expo } from "expo-server-sdk";
import twilio from 'twilio';
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken, {
  lazyLoading: true
});

const expo = new Expo();

import mongoose from 'mongoose';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.EMAIL,
         pass: process.env.PASS
     }
 });


 //date initialization
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year

 class JobController {



  static async driverRequest (request:Request, response:Response){
    const {category, payment, uid, location, area1, area2, lat, long, destLat, destLong, to, from, time, distance, price, to2, destLat2, destLong2} = request.body;
    //console.log(category, uid,location)
    //console.log("area1:" + area1);
    //console.log("area2:" + area2);
    //console.log("lat:" + lat);
    //console.log("long:" + long)
    //console.log("destLat:" + destLat);
    //console.log("destLong:" + destLong);
    //console.log("to:" + to);
    //console.log("from:" + from);
    //console.log("time:" + time);
    //console.log("distance:" + distance);
    //console.log("price:" + price);
    
    

    let savedTokens;

    const user = await Schema.User().findOne({_id: uid});

    try {

      if(payment == 'wallet' && price > user.balance){
        console.log("You don't have sufficient balance in your wallet. Please fund your wallet and try again")
          return response.send({error: "You don't have sufficient balance in your wallet. Please fund your wallet and try again"})
        
      }


        //create job
        const dt = new Date()
      

       // console.log(createdAt)
        //console.log("end:" + endAt)
        //console.log("now:" + now)

      const job =  await Schema.Job().create({
            user: uid,
          
          
            category: category,
            location: location,
            status: 'active',
            payment: payment,
            rated: false,
            
            area1: area1,
            area2: area2,
            to: to,
            to2: to2,

            from: from,
            lat: lat,
            long: long,

            destLat: destLat,
            destLat2: destLat2,

            destLong: destLong,
            destLong2: destLong2,

            time: time,
            price: price,
            distance: distance,
            createdAt: today,
            active: true

        })

        console.log("job id!!!!" + job.id)
 
        response.status(201).send({

            job_id: job.id,
            message: 'Job created successfully',
            status: 201
          });



   
     const artisan = await Schema.Artisan().find({category: category, pushToken: {$exists: true}}).where({area1: area1,$or:[{area2: area2}]})  
     
     if (!artisan) {
      return response.status(404).send({
        message: 'No driver found'
      });
    }
     console.log(artisan)

     artisan.map(artis => {

      console.log(artis.pushToken);

    
      

    
     
      
 
 
      //send notification
  
      let chunks = expo.chunkPushNotifications([{
        "to": [artis.pushToken],
        "sound": "default",
        "channelId": "notification-sound-channel",
        "title": "Ride Request",
        "body": "Open your Platabox App"
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
 
      

     })
     
  

     
  
 
      
  
    
    } catch(error){
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong"
        })
    }


  }

  static async logRequest (request:Request, response:Response){

    const {city, city2, payment, category, uid, location, lat, long, destLat, destLat2, destLat3, destLat4, destLat5, destLong, destLong2, destLong3, destLong4, destLong5, to, to2, to3, to4, to5, from, time, distance, price, pTime, p1,p2,p3,p4,p5} = request.body;
  //console.log(category)



   

    
    const user = await Schema.User().findOne({_id: uid});
    //console.log(price)
    //console.log(user.balance)
    if(!user){
      return response.status(400).send({error: "User not found"})
    }

    try {

      //check if it's a wallet payment
    //verify if user has enough money
    if(payment == 'wallet' && price > user.balance){
        console.log("You don't have sufficient balance in your wallet. Please fund your wallet and try again")
          return response.status(500).send({error: "You don't have sufficient balance in your wallet. Please fund your wallet and try again"})
        
      }
        //create job
        const dt = new Date()
        const now = dt.setMinutes( dt.getMinutes());
        const createdAt = dt.toLocaleDateString()
        const endAt =  dt.setMinutes( dt.getMinutes() + 30 );
       // console.log(pTime)
        //console.log("end:" + endAt)
        //console.log("now:" + now)

        //create confirmation code
        const confirmationCode = String(Date.now()).slice(9, 13);

      const job =  await Schema.Job().create({
            user: uid,
            otp: confirmationCode,
          
          
            category: category,
            location: location,
            city: city === undefined ? '' : city.trim(),
            city2: city2 === undefined ? '' : city2.trim(),

            n1: p1,
            n2: p2,
            n3: p3,
            n4: p4,
            n5: p5,
          

            status: 'active',
            payment: payment,
            rated: false,
           
            to: to,
            to2: to2,
            to3: to3,
            to4: to4,
            to5: to5,

            from: from,
       
            lat: lat,
            long: long,

            destLat: destLat,
            destLat2: destLat2,
            destLat3: destLat3,
            destLat4: destLat4,
            destLat5: destLat5,

            destLong: destLong,
            destLong2: destLong2,
            destLong3: destLong3,
            destLong4: destLong4,
            destLong5: destLong5,

            time: time,
            price: price,
            distance: distance,
            createdAt: today,
            endAt: endAt,
            now: now,
            active: true

        })

        //console.log("job id!!!!" + job.id)
 
        response.status(201).send({

            job_id: job.id,
            message: 'Job created successfully',
            status: 201
          });

    //send otp to receivers if number is not undefined
    const message = `Delivery Token: ${confirmationCode}`;
  

      if(p1.length > 0 && p1 !== undefined && payment === 'wallet' ){
    client.messages
        .create({
          body: message,
          from: '+17076402854',
          to: p1
        });
      }

        if(p2.length > 0 && p2 !== undefined && payment === 'wallet' ){
          client.messages
          .create({
            body: message,
            from: '+17076402854',
            to: p2
          });
        }

        if(p3.length > 0 && p3 !== undefined && payment === 'wallet'){
          client.messages
          .create({
            body: message,
            from: '+17076402854',
            to: p3
          });
        }

        if(p4.length > 0 && p4 !== undefined && payment === 'wallet'){
          client.messages
          .create({
            body: message,
            from: '+17076402854',
            to: p4
          });
        }

        if(p5.length > 0 && p5 !== undefined && payment === 'wallet'){
          client.messages
          .create({
            body: message,
            from: '+17076402854',
            to: p5
          });
        }
    


        
        const artisan = await Schema.Artisan().find({category: 'log', pushToken: {$exists: true},  $or:[{city: city === undefined ? '' : city.trim()},{ city: city2 === undefined ? '' : city2.trim() }, { city2: city === undefined ? '' : city.trim() }, { city2: city2 === undefined ? '' : city2.trim() }, {phone: '+2349038826995'} ] })
     

     if (!artisan) {
      return response.status(404).send({
        message: 'No riders found'
      });
    }
     console.log("send notification:" + artisan)

     artisan.map((artis:any) => {

      console.log("push tokens:" + artis.pushToken);

    
      

    

      
 
 
      //send notification
  
      let chunks = expo.chunkPushNotifications([{
        "to": [artis.pushToken],
        "sound": "default",
        "channelId": "notification-sound-channel",
        "title": "New Request",
        "body": "A dispatch Rider is needed!"
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
 
      

     })
     
   
      
  
    
    } catch(error){
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong"
        })
    }
  }

  


  //display requests
  static async displayJobs(request:Request, response:Response) {
      const {category, area1, area2} = request.body; 
      console.log(category);
      console.log("area1:" + area1);
      console.log("area2:" + area2);
      
      
    const job = await Schema.Job().find({category: category}).where({$or:[{area1: area1 }, {area1: area2}, {area2: area1}, {area2: area2}]}).and([{status: 'active'}]).sort({'_id': -1})
 
    console.log(job)

    //get hirer id
  const user = job.map(usr => {
    return usr.user
})

const hirer = await Schema.User().findOne({_id: user});
console.log("hirer:" + hirer)
    return response.status(200).send({job: job, hirer:hirer})

  }

  

  //display logistics requests
  static async logRequests(request:Request, response:Response) {
 
    const {category, city, city2} = request.body; 
    //console.log(category);
    //console.log("city:" + city);
    //console.log("city2:" + city2);
    const job = await Schema.Job().find({category: 'log', $or:[{city: city === undefined ? '' : city.trim()},{ city: city2 === undefined ? '' : city2.trim() }, { city2: city === undefined ? '' : city.trim() }, { city2: city2 === undefined ? '' : city2.trim() }] }).and([{status: 'active'}]).sort({'_id': -1})   

  //console.log(job)

  //get hirer id
const user = job.map(usr => {
  return usr.user
})

const hirer = await Schema.User().findOne({_id: user});
//console.log("hirer:" + hirer)
  return response.status(200).send({job: job, hirer:hirer})



}


  static async acceptJob(request:Request, response:Response){

    const {uid, job_id, price} = request.body
    console.log("uid" + uid, "job_id" + job_id)
    
    let savedTokens;

  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)
const artisan = await Schema.Artisan().findOne({_id: uid});
console.log(price);
    console.log("artisan name " + artisan.name)
    console.log("artisan phone " + artisan.phone)

    
   
   
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
                artisan_name: artisan.name,
                artisan_phone: artisan.phone,
                status: 'accepted',
                price: price
            }
        }
        );


        response.status(200).send({hirer: hirer.name, number: hirer.phone, job: job})
       
// send notification


savedTokens = hirer.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
  "to": savedTokens,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Request Accepted!",
  "body": `A driver has accepted your request.`
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




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }


  static async acceptTaxi(request:Request, response:Response){

    const {uid, job_id, price} = request.body
    console.log("uid" + uid, "job_id" + job_id)
    
    let savedTokens;

  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)
const artisan = await Schema.Artisan().findOne({_id: uid});
console.log(price);
    console.log("artisan " + artisan.name)

    
     
   
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
                artisan_name: artisan.name,
                price: price
            }
        }
        );


        response.status(200).send({hirer: hirer.name, number: hirer.phone, job: job})
       
// send notification


savedTokens = hirer.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
  "to": savedTokens,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Request Accepted!",
  "body": `A Driver has accepted your request and is on his way.`
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




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }




  static async acceptLog(request:Request, response:Response){

    const {uid, job_id, price} = request.body
    console.log("uid" + uid, "job_id" + job_id)
    
    let savedTokens;
    let total_price;


  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

    const artisan = await Schema.Artisan().findOne({_id: uid});

    //check if artisan exists first
    if(!artisan){
      return response.status(404).send({
        message: 'Account does not exist'
      });

    }
    console.log(artisan);
    console.log("artisan " + artisan.name)


//add price of job to driver
 total_price = Math.round(artisan.cash + parseInt(price)) 


   
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
                artisan_name: artisan.name,
                artisan_phone: artisan.phone,
                price: price
            }
        }



        );

        //add cash to driver(owner) if it is cash payment
        if(job.payment === 'cash'){
         
          await Schema.Artisan().updateOne({
            _id: uid
        },
        {
            $set: {
              cash: total_price,
              total_funds: Math.round(artisan.total_funds + parseInt(price)) 
            }
        }
  
  
  
        );

 //if it is a subaccount then credit owner
          if(artisan.sub === 'yes'){
            const owner = await Schema.Artisan().findOne({_id: artisan.owner});
            const owner_price = Math.round(owner.cash + parseInt(price)) 

            await Schema.Artisan().updateOne({
              _id: artisan.owner
          },
          {
              $set: {
                cash: owner_price,
                total_funds: Math.round(owner.total_funds + parseInt(price)) 
              }
          }
    
    
    
          );
          } 
           
          

        }
    

      

  

        response.status(200).send({hirer: hirer.name, number: hirer.phone, job: job})
       
// send notification


savedTokens = hirer.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
  "to": savedTokens,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Request Accepted!",
  "body": `A Dispatcher has accepted your request.`
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




    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }

  

  static async showJob(request:Request, response:Response){

    const {uid, job_id} = request.body
    console.log("uid" + uid, "job_id" + job_id)
    
 

  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

        //find artisan

  const arti = await Schema.Artisan().findOne({_id: job.artisan})
  console.log("artisan found:" + arti);

const artisan = await Schema.Artisan().findOne({_id: uid});


  
    if (!job && !hirer) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   


    try {
     
      response.status(200).send({hirer: hirer.name, number: hirer.phone, job: job, artisan: arti})



    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }




  static async cancelJob(request:Request, response:Response){

    const {uid, job_id} = request.body
    console.log("job_id" + job_id)
    
    let total_price;


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

       
       const artisan = await Schema.Artisan().findOne({_id: job.artisan});
       console.log("artisan:" + artisan)
 
        if(artisan.cash > 0){
          total_price = Math.round((artisan.cash) - parseInt(job.price))
        } else {
          total_price = artisan.cash
        }

    

    
    if (!job && !hirer) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   
    try {

//send notification

let chunks = expo.chunkPushNotifications([{
  "to":  artisan.pushToken,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Request Canceled!",
  "body": `${hirer.name} canceled his request.`
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


        await Schema.Job().updateOne({
          _id: job_id
        },
          {
            $set: {
              status: 'cancelled'
            }
         
          }
          
          );


          if(job.payment === 'cash'){
            await Schema.Artisan().updateOne({
              _id: job.artisan
          },
          {
              $set: {
                cash: total_price,
                total_funds: Math.round(artisan.total_funds - parseInt(job.price)) 
              }
          }
    
    
    
          );

          //if it's subaccount deduct from subaccount too
          if(artisan.sub === 'yes'){
            const owner = await Schema.Artisan().findOne({_id: artisan.owner});
            const owner_price = Math.round(owner.cash - parseInt(job.price)) 
            await Schema.Artisan().updateOne({
              _id: artisan.owner
          },
          {
              $set: {
                cash: owner_price,
                total_funds: Math.round(owner.total_funds - parseInt(job.price)) 
              }
          }
    
    
    
          );
          } 
            
          }
          console.log("cancelled");
          response.status(201).send({
              message: 'Task Cancelled successfully',
              status: 201
            });
    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }










  static async deleteJob(request:Request, response:Response){

    const {job_id} = request.body
    console.log("job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       
       


    
    if (!job) {
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
  
  
  //not in use
  static async cancelArtisan(request:Request, response:Response){

    const {uid, job_id} = request.body
    console.log("job_id" + job_id)
    
    let total_price;
  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

       const artisan = await Schema.Artisan().findOne({_id: uid});
       console.log("artisan:" + artisan)
       
       if(artisan.earnings > 0){
        total_price = Math.round((artisan.earnings) - job.price)
      } else {
        total_price = artisan.earnings
      }


    
    if (!job && !hirer) {
        return response.status(404).send({
          message: 'Job does not exist'
        });
      }
   
    try {


//send notification

let chunks = expo.chunkPushNotifications([{
  "to": hirer.pushToken,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Request Canceled!",
  "body": `${artisan.name} canceled the Request`
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





        await Schema.Job().updateOne({
          _id: job_id
        },
          {
            $set: {
              status: 'cancelled'
            }
         
          }
          
          );

          await Schema.Artisan().updateOne({
            _id: job.artisan
        },
        {
            $set: {
              earnings: total_price
            }
        }
  
  
  
        );

        console.log("deleted");
        response.status(201).send({
            message: 'Task Cancelled successfully',
            status: 201
          });
       





console.log(hirer.pushToken)


          



    } catch(error) {
        console.log(error)
        return response.status(404).send("an error occured")
    }
  



  }

  static async completeJob(request:Request, response:Response){

    let savedTokens = [];
    const {job_id} = request.body
    console.log( "job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

    const hirer = await Schema.User().findOne({_id: job.user});
    console.log("hirer:" + hirer)

    
    const artisan = await Schema.Artisan().findOne({_id: job.artisan});
    console.log("artisan:" + artisan)
    const completed =  Math.round(artisan.completed + 1)

    const owner = await Schema.Artisan().findOne({_id: artisan.owner});

  
    



    /**
     *  let earnings; 
    if(artisan.category === 'log'){
      earnings = 0;
    } else {
      earnings =  job.price;
    }
     */
   
   
       
    
    if (!job || !hirer ||!artisan){
      //delete request
        return response.status(201).send({
          message: 'Job does not exist or invalid user'
        });
      }

      if(job.status === 'cancelled' || job.status === 'completed'){
        
        return response.status(400).send({
          message: 'Request was cancelled'
        });
      }
   
    try {
        await Schema.Job().updateOne({
            _id: job_id
        },
        {
            $set: {
                status: 'completed'
            }
        }
        );
        //update rider job count
        await Schema.Artisan().updateOne({
            _id: artisan._id
        },
        {
          $set: {
            start: false,
            arrived: false,
            completed: completed
          }
        }
        );

        //debit user
        const new_balance = hirer.balance - parseInt(job.price)
        console.log(new_balance)
        
        if(job.payment == 'wallet'){

          // debit user
          await Schema.User().updateOne({
            _id: hirer._id
        },
        {
            $set: {
                balance: new_balance
            }
        }
        );

         //update user transaction
         await Schema.Transaction().create({
          user: hirer._id,
          amount: job.price,
          status: 'withdraw',
          date: today
          })

          //send debit alert
           //notify user
  let chunks = expo.chunkPushNotifications([{
    "to": hirer.pushToken,
    "sound": "default",
    "channelId": "notification-sound-channel",
    "title": `Successful Payment :)`,
    "body": `₦ ${job.price} has been deducted from your wallet for your last request`
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




        //credit driver (main account)
          //find main account
         if(artisan.sub === 'yes'){
  
         if(owner){
          //credit account
               await Schema.Artisan().updateOne({
                _id: artisan.owner
            },
            {
                $set: {
                  earnings: owner.earnings + parseInt(job.price),
                  total_funds: Math.round(owner.total_funds + parseInt(job.price)) 
                }
            }
            );
            //update transaction
            await Schema.Transaction().create({
              user: artisan.owner,
              amount: job.price,
              status: 'funded',
              date: today
              })
            //send credit alert
             //notify user
  let chunks = expo.chunkPushNotifications([{
    "to": owner.pushToken,
    "sound": "default",
    "channelId": "notification-sound-channel",
    "title": `Credit Alert!`,
    "body": `₦ ${job.price} has been paid into your wallet for the last request`
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


         } else {
           //owner not found. set status invalid task
           await Schema.Job().updateOne({
            _id: job_id
        },
        {
            $set: {
                status: 'invalid. contact us'
            }
        }
        );

         }

     } else {
       //credit main acccout
       await Schema.Artisan().updateOne({
        _id: artisan._id
    },
    {
        $set: {
          earnings: artisan.earnings + parseInt(job.price),
          total_funds: Math.round(artisan.total_funds + parseInt(job.price)) 
        }
    }
    );
    //update transaction
    await Schema.Transaction().create({
      user: artisan._id,
      amount: job.price,
      status: 'funded',
      date: today
      })

       //send credit alert
       let chunks = expo.chunkPushNotifications([{
        "to": artisan.pushToken,
        "sound": "default",
        "channelId": "notification-sound-channel",
        "title": `Credit Alert!`,
        "body": `₦ ${job.price} has been paid into your wallet for the last request`
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
        }
        response.status(201).send({
           message: "Completed",
           status: 201
       })
    
//send notification to user

let chunks = expo.chunkPushNotifications([{
  "to": hirer.pushToken,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Ride Completed!",
  "body": 'Yay! Ride completed'
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

    
  const job = await Schema.Job().find({artisan: uid}).sort({'_id': -1})  

  //console.log(job)

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
    var total = 0;


    const {uid, name, job_id} = request.body; 

    let savedTokens;

    console.log("category" + name);
    console.log("user:" + uid);

    const user = await Schema.User().findOne({_id: uid});
    console.log(user)
    
    // find artisan
  const job = await Schema.Job().findOne({_id: job_id,  $and: [{category: name}]}).where('status').equals('accepted')

  console.log('Job A' + job)
 
    if(job){
      const findArtisan = await Schema.Artisan().findOne({_id: job.artisan})
      console.log(findArtisan)
    

 

  
 
try {


 
 
    const getRating = findArtisan.rating
    console.log(getRating.length);

    for(var i = 0; i < getRating.length; i++){
        total += getRating[i]
    }
    var rate = Math.round(total / getRating.length);
    console.log("rating:" + rate)


         response.status(200).send({artisan: findArtisan, job: job, rating: rate})
      
  
     
// send notification


savedTokens = user.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
  "to": savedTokens,
  "sound": "default",
  "channelId": "notification-sound-channel",
  "title": "Yay! Dispatcher Found",
  "body": `Open your Platabox App`
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


  
  
} catch(error) {

    console.log(error);
    response.status(404).send("something went wrong")

}

  } else {
    console.log("No Driver Available")
    return response.status(404).send("no driver yet")
}

 

}

static async trackReq(request:Request, response:Response) {
  var total = 0;


  const {uid, name, job_id} = request.body; 

  let savedTokens;

  console.log("category" + name);
  console.log("user:" + uid);

  const user = await Schema.User().findOne({_id: uid});
  console.log(user)
  
  // find artisan
const job = await Schema.Job().findOne({_id: job_id,  $and: [{category: name}]}).where('status').equals('accepted')

console.log('Job A' + job)

  if(job){
    const findArtisan = await Schema.Artisan().findOne({_id: job.artisan})
    console.log(findArtisan)
  





try {




  const getRating = findArtisan.rating
  console.log(getRating.length);

  for(var i = 0; i < getRating.length; i++){
      total += getRating[i]
  }
  var rate = Math.round(total / getRating.length);
  console.log("rating:" + rate)


       response.status(200).send({artisan: findArtisan, job: job, rating: rate})
    

   
// send notification


savedTokens = user.pushToken;

console.log(savedTokens)






} catch(error) {

  console.log(error);
  response.status(404).send("something went wrong")

}

} else {
  console.log("No Driver Available")
  return response.status(404).send("no driver yet")
}



}


// Job Rating

static async checkRating(request: Request, response: Response){
    const {uid} = request.body;
    console.log("user:" + uid)


    const job =  await Schema.Job().findOne({user: uid}).where('rated').equals(false).where('status').equals('completed')
    console.log(job);

if(job){


    const artisan = await Schema.Artisan().findOne({_id: job.artisan});

    
    if(artisan){

    try {

   
            return response.status(201).send({
                job: job,
                artisan: artisan
            })
            
        } catch(error) {
        console.log(error)
        return response.status(400).send({
            message: "error"
        })
    }
} else {
    return response.status(400).send({
        message: "No Artisan to rate"
    })
}
} else {
    return response.status(400).send({
        message: "No Job to rate"
    })
}
    
}


static async rateArtisan(request: Request, response: Response){
    const { uid, rate, comment} = request.body;
    console.log("user:" + uid)
    
    let savedTokens;
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
       
         
            await Schema.Job().updateOne({
                _id: job._id
            },
            {
                $set: {
                    rated: "true"
                }
            }
            );
       
            
             response.status(201).send({
                message: "Artisan rated"
            })


//send notification

savedTokens = artisan.pushToken;

let chunks = expo.chunkPushNotifications([{
    "to": savedTokens,
    "sound": "default",
    "channelId": "notification-sound-channel",
    "title": "New Rating",
    "body": 'You just got rated for your last job.'
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
  
        
     

        } catch(error) {
        console.log(error)
        return response.status(400).send({
            message: "error"
        })
    }


    }
   
 
    
}

// start job

static async startJob(request:Request, response:Response){

  const {job_id} = request.body

  
  let savedTokens;



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
      await Schema.Artisan().updateOne({
          _id: job.artisan
      },
      {
          $set: {
            start: true
          }
      }
      );

console.log('job started')
      response.status(200).send('job started')
     
// send notification


savedTokens = hirer.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
"to": savedTokens,
"sound": "default",
"channelId": "notification-sound-channel",
"title": "Trip Started!",
"body": `Your driver has started the trip.`
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




  } catch(error) {
      console.log(error)
      return response.status(404).send("an error occured")
  }




}

//check if job has started
static async startedJob(request:Request, response:Response) {


  const {uid, name} = request.body; 



  const user = await Schema.User().findOne({_id: uid});
  //console.log(user)
  
  // find artisan
const job = await Schema.Job().findOne({user: uid,  $and: [{category: name}]}).where('status').equals('accepted')


  console.log(job);


if(job){
const findArtisan = await Schema.Artisan().findOne({_id: job.artisan})
//console.log(findArtisan)


try {
       response.status(200).send({artisan: findArtisan.start})
    
} catch(error) {

  console.log(error);
  response.status(404).send("something went wrong")

}

} else {
  console.log("No Driver Available")


}



}



// driver arrived
static async driverArrived(request:Request, response:Response){

  const {job_id} = request.body

  
  let savedTokens;



  const job = await Schema.Job().findOne({_id: job_id})
  //console.log("job found:" + job);

  const driver = await Schema.Artisan().findOne({_id: job.artisan});
  //console.log("driver:" + driver)


     const hirer = await Schema.User().findOne({_id: job.user});
     //console.log("hirer:" + hirer)

  
 
  if (!job && !hirer) {
      return response.status(404).send({
        message: 'Job does not exist'
      });
    }
 
    if(driver.arrived === false){
      try {
  
        await Schema.Artisan().updateOne({
          _id: job.artisan
      },
      {
          $set: {
            arrived: true
          }
      }
      );
         
    // send notification
    
    
    
    savedTokens = hirer.pushToken;
    
    //console.log(savedTokens)
    
    
    
    
    //send notification
    
    let chunks = expo.chunkPushNotifications([{
    "to": savedTokens,
    "sound": "default",
    "channelId": "notification-sound-channel",
    "title": "Driver Arrival!",
    "body": `Your driver has arrived.`
    }]);
    let tickets = [];
    (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        response.status(200).send('driver arrived')
      } catch (error) {
        console.error(error);
      }
    }
    })();
    
    
    
    
      } catch(error) {
          console.log(error)
          return response.status(404).send("an error occured")
      }
    
    } else {
      response.status(200).send('Already Notified')
    }




}







//job history 
static async getHistory(request:Request, response:Response){
  const {uid} = request.body;

  //get user 
  const user = await Schema.User().findOne({_id: uid})
  console.log(user)
  //get user jobs
  const job = await Schema.Job().find({user: uid}).sort({'_id': -1})  
  console.log(job)

  if(user){
    return response.status(200).send({
      job: job
    })
  } else {
    console.log('no user')
    response.status(404).send('no user found')
  }


}


//Emergency Call





//GET DELIVERY REQUESTS
static async Deliveries(request: Request, response: Response) {


  try {
    const deliveries = await Schema.Job().find({'category': 'log'}).sort({'_id': -1})  
    console.log(deliveries)
    return response.status(200).send({value: deliveries})
  } catch(error) {
      console.log(error.toString());
  return  response.status(500).send({
      message: 'something went wrong'
    });
  }
}

//RIDES
static async Rides(request: Request, response: Response) {


  try {
    const rides = await Schema.Job().find({'category': 'driver'}).sort({'_id': -1})  
    console.log(rides)
    return response.status(200).send({value: rides})
  } catch(error) {
      console.log(error.toString());
  return  response.status(500).send({
      message: 'something went wrong'
    });
  }
}




 }



 export default JobController;