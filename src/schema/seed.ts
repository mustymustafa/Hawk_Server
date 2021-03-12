import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import Schema from './schema';


const salt = bcrypt.genSaltSync(10);



const seedUser = async () => {
  await Schema.User().create({
    name: 'Platabox Test',
    email: 'user@hawk.com',
    phone: '+2349038826995',
    password: bcrypt.hashSync('musty100', salt),
    isConfirmed: true,

  });
}

export const seedArtisan = async () => {
    await Schema.Artisan().create({
      name: 'admin',
      email: 'admin@platabox.com',
      phone: '+2349038826995',
      password: bcrypt.hashSync('musty100', salt),
      isConfirmed: true,
      isActivated: true,
      pic: 'musty',
      identification: 'pic'
  
    });
  }



export default seedUser;

