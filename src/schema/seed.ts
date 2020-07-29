import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import Schema from './schema';


const salt = bcrypt.genSaltSync(10);



const seedUser = async () => {
  await Schema.User().create({
    name: 'user',
    email: 'user@hawk.com',
    phone: '09038826995',
    password: bcrypt.hashSync('musty100', salt),
    isConfirmed: true,

  });
}

export const seedArtisan = async () => {
    await Schema.Artisan().create({
      name: 'user',
      email: 'artisan@hawk.com',
      phone: '09038826995',
      password: bcrypt.hashSync('musty100', salt),
      isConfirmed: true,
      isActivated: true,
      pic: 'musty',
      identification: 'pic'
  
    });
  }



export default seedUser;

