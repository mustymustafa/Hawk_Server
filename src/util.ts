import { access } from "fs";

const multer = require('multer'),
  aws = require('aws-sdk'),
  multerS3 = require('multer-s3'),
  path = require('path');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY_ID,
  Bucket: process.env.AWS_S3_BUCKET,
});


// Initialize multers3 with our s3 config and other options
export const upload = multer({
  storage: multerS3({
    s3,
    bucket:  process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    metadata(req:any, file:any, cb:any) {
      console.log(cb)
      console.log(file)
      cb(null, {fieldName: file.fieldname});
    },
    key(req:any, file:any, cb:any) {
      cb(null, Date.now().toString() + '.png');
    }
  })
})
