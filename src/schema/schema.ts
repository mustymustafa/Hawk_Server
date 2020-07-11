import mongoose from 'mongoose';

const {Schema: MongooseSchema} = mongoose;

class Schema {
    static User() {
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            phone: String,
            password: String,
            pushToken: String,
            confirmationCode: String,
            isConfirmed: Boolean

        })
        const User = mongoose.models.User || mongoose.model('User', UserSchema)
        return User;
    }

    static Artisan() {
        const ArtisanSchema = new mongoose.Schema({
            name: String,
            email: String,
            phone: String,
            password: String,
            pic: String,
            bio: String,
            category: String,
            wage: Number,
            idCard: String,
            cert: String,

            id_expiry: String,
            vir: String,
            vl: String,
            vl_expiry: String,
            insurance: String,
            poo: String,
            vcolor: String,
            vmodel: String,
            plate: String,
            vpic: String,
            sname: String,
            sphone: String,

            lat: String,
            long: String,
            location: String,
            start: {type: Boolean, default: false},
            arrived: {type: Boolean, default: false},
            

            
            completed: {type: Number, default: 0},
            rating: [Number],
            earnings: [Number],
            comments: [String],
            area1: String,
            area2: String,
            confirmationCode: String,
            pushToken: String,
            isConfirmed: Boolean,
            isActivated: Boolean,
            createdAt: String,
            expireAt: String,
            active: {type: Boolean, default: false}
             

        })
        const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema)
        return Artisan;
    }

    static Job() {
        const JobSchema = new mongoose.Schema({
            category: String,
            user: {type: MongooseSchema.Types.ObjectId, ref: 'User'},
            artisan: {type: MongooseSchema.Types.ObjectId, ref: 'Artisan'},
            artisan_name: String,
            location:  String,
            to: String, 
            to2: String, 
            to3: String, 
            to4: String, 
            to5: String, 
            
            from: String,
            lat: String,
            long: String,

            destLat: String,
            destLat2: String,
            destLat3: String,
            destLat4: String,
            destLat5: String,

            destLong: String,
            destLong2: String,
            destLong3: String,
            destLong4: String,
            destLong5: String,

            distance:  String,
            time: String,

           

            area1: String,
            area2: String,
            description: String,
            price: String,
            paid: Boolean,
            status: String,
            createdAt: String,
            rated: Boolean,
            now: Number,
            endAt: Number,


            active: Boolean

            
        })
        const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)
        return Job;
    }


    static Emergency() {
        const EmergencySchema = new mongoose.Schema({
         
            user: {type: MongooseSchema.Types.ObjectId, ref: 'User'},
            artisan: {type: MongooseSchema.Types.ObjectId, ref: 'Artisan'},
           
            location:  String,
        
            lat: String,
            long: String, 

            area1: String,
            area2: String,
            
            createdAt: {type: Date, default: Date.now},
        
            
        })
        const Emergency = mongoose.models.Emergency || mongoose.model('Emergency', EmergencySchema)
        return Emergency;
    }

}

export default Schema;