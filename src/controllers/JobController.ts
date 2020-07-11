import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import Schema from '../schema/schema';
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


let title;
        
     const artisan = await Schema.Artisan().findOne({category: category})
     
     if(category === 'driver'){
       title = 'Ride Request'
     }

     if (category === 'log' || category === 'shop'){
       title = 'Dispatch Rider Request'
     }
      const artis = artisan.pushToken;

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
        "title": title,
        "body": "Open your Sleek App"
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

      

      
  
 
      
  
    
    } catch(error){
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong"
        })
    }


  }

  static async driverRequest (request:Request, response:Response){
    const {category, uid, location, area1, area2, lat, long, destLat, destLong, to, from, time, distance, price} = request.body;
    console.log(category, uid,location)
    console.log("area1:" + area1);
    console.log("area2:" + area2);
    console.log("lat:" + lat);
    console.log("long:" + long)
    console.log("destLat:" + destLat);
    console.log("destLong:" + destLong);
    console.log("to:" + to);
    console.log("from:" + from);
    console.log("time:" + time);
    console.log("distance:" + distance);
    console.log("price:" + price);
    
    

    let savedTokens;


    try {


        //create job
        const dt = new Date()
        const now = dt.setMinutes( dt.getMinutes());
        const createdAt = dt.toLocaleDateString()
        const endAt =  dt.setMinutes( dt.getMinutes() + 30 );
        console.log(createdAt)
        console.log("end:" + endAt)
        console.log("now:" + now)

      const job =  await Schema.Job().create({
            user: uid,
            category: category,
            location: location,
            status: 'active',
            rated: false,
            area1: area1,
            area2: area2,
            to: to,
            from: from,
            lat: lat,
            long: long,
            destLat: destLat,
            destLong: destLong,
            time: time,
            price: price,
            distance: distance,
            createdAt: createdAt,
            endAt: endAt,
            now: now,
            active: true

        })

        console.log("job id!!!!" + job.id)
 
        response.status(201).send({

            job_id: job.id,
            message: 'Job created successfully',
            status: 201
          });



   
     const artisan = await Schema.Artisan().findOne({category: category}).where({area1: area1,$or:[{area2: area2}]})  
     
    
     console.log(artisan)
     
     const artis = artisan.pushToken;

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
       "title": "Ride Request",
       "body": "Open your Sleek App"
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

     

     
  
 
      
  
    
    } catch(error){
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong"
        })
    }


  }

  static async logRequest (request:Request, response:Response){
    const {category, uid, location, lat, long, destLat, destLat2, destLat3, destLat4, destLat5, destLong, destLong2, destLong3, destLong4, destLong5, to, to2, to3, to4, to5, from, time, distance, price} = request.body;
  console.log(category)
  
    let savedTokens;


    try {


        //create job
        const dt = new Date()
        const now = dt.setMinutes( dt.getMinutes());
        const createdAt = dt.toLocaleDateString()
        const endAt =  dt.setMinutes( dt.getMinutes() + 30 );
        console.log(createdAt)
        console.log("end:" + endAt)
        console.log("now:" + now)

      const job =  await Schema.Job().create({
            user: uid,
            category: category,
            location: location,
            status: 'active',
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
            createdAt: createdAt,
            endAt: endAt,
            now: now,
            active: true

        })

        console.log("job id!!!!" + job.id)
 
        response.status(201).send({

            job_id: job.id,
            message: 'Job created successfully',
            status: 201
          });



        
     const artisan = await Schema.Artisan().findOne({category: 'log'});
     

     console.log(artisan)
     
     const artis = artisan.pushToken;

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
       "title": "New Request",
       "body": `A Dispatch Rider is needed.`
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
      if(category === 'log'){
        //later query based of state
        const job = await Schema.Job().find({category: category});
    
      } else {
    const job = await Schema.Job().find({category: category}).where({area1: area1,$or:[{area2: area2}], $and: [{status: 'active'}]})  
 
    console.log(job)

    //get hirer id
  const user = job.map(usr => {
    return usr.user
})

const hirer = await Schema.User().findOne({_id: user});
console.log("hirer:" + hirer)
    return response.status(200).send({job: job, hirer:hirer})

  }

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
    console.log("wage " + artisan.wage)

    
       if(!price || price > artisan.wage){
        return response.status(404).send({
            message: `Please enter a price between (₦)0-${artisan.wage}`
          });
       }
   
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
  "title": "Request Accepted!",
  "body": `A/an ${job.category} has accepted your request.`
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
    console.log("wage " + artisan.wage)

    
     
   
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


        response.status(200).send({hirer: hirer.name, number: hirer.phone, job: job})
       
// send notification


savedTokens = hirer.pushToken;

console.log(savedTokens)




//send notification

let chunks = expo.chunkPushNotifications([{
  "to": savedTokens,
  "sound": "default",
  "title": "Request Accepted!",
  "body": `Your ${job.category} has accepted your request and is on his way.`
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
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

       
       const artisan = await Schema.Artisan().findOne({_id: job.artisan});
       console.log("artisan:" + artisan)

       
       


    
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
  "title": "Job Canceled!",
  "body": `${hirer.name} canceled his job request.`
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
  
  
  static async cancelArtisan(request:Request, response:Response){

    const {uid, job_id} = request.body
    console.log("job_id" + job_id)
    
  

    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);

       const hirer = await Schema.User().findOne({_id: job.user});
       console.log("hirer:" + hirer)

       const artisan = await Schema.Artisan().findOne({_id: uid});
       console.log("artisan:" + artisan)
       
       


    
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
  "title": "Job Canceled!",
  "body": `The ${artisan.category},  ${artisan.name} canceled the Job`
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
    const {job_id,} = request.body
    console.log( "job_id" + job_id)
    


    const job = await Schema.Job().findOne({_id: job_id})
    console.log("job found:" + job);
    const hirer = await Schema.User().findOne({_id: job.user});
    console.log("hirer:" + hirer)

    
    const artisan = await Schema.Artisan().findOne({_id: job.artisan});
    console.log("artisan:" + artisan)

       
    
    if (!job) {
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
                status: 'completed',
                start: false,
                arrived:false
            }
        }
        );

        await Schema.Artisan().updateOne({
            _id: artisan._id
        },
        {
            $inc: {
                completed: 1
            },
            $push: {
             earnings: job.price
          }
        }
        );


        response.status(201).send({
           message: "Completed",
           status: 201
       })
    
       









//send notification

let chunks = expo.chunkPushNotifications([{
  "to": hirer.pushToken,
  "sound": "default",
  "title": "Job Completed!",
  "body": 'Yay! your Job is done.'
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

    
  const job = await Schema.Job().find({artisan: uid})

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


    const {uid, name} = request.body; 

    let savedTokens;

    console.log("category" + name);
    console.log("user:" + uid);

    const user = await Schema.User().findOne({_id: uid});
    //console.log(user)
    
    // find artisan
  const job = await Schema.Job().findOne({user: uid,  $and: [{category: name}]}).where('status').equals('accepted')
 

    console.log(job);


 
  const findArtisan = await Schema.Artisan().findOne({_id: job.artisan})
  console.log(findArtisan)

  if(!findArtisan){
      console.log("No Artisan Available")
      return response.status(400).send({notFound: "No Artisan is available at the moment"})

  }

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
  "title": "Artisan Found!",
  "body": `Yay! We have found your nearest ${job.category}`
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



const findArtisan = await Schema.Artisan().findOne({_id: job.artisan})
console.log(findArtisan)

if(!findArtisan){
    console.log("No Artisan Available")
    return response.status(400).send({notFound: "No Artisan is available at the moment"})

}

try {






       response.status(200).send({artisan: findArtisan.start})
    

   


} catch(error) {

  console.log(error);
  response.status(404).send("something went wrong")

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
  const job = await Schema.Job().find({user: uid})
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




 }



 export default JobController;