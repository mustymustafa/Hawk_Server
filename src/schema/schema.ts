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
            wage: String,
            idCard: String,
            lat: String,
            long: String,
            location: String,
            rating: [Number],
            comments: [String],
            area1: String,
            area2: String,
            confirmationCode: String,
            pushToken: String,
            rated: Boolean,
            isConfirmed: Boolean,
            isActivated: Boolean

        })
        const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema)
        return Artisan;
    }

    static Job() {
        const JobSchema = new mongoose.Schema({
            category: String,
            user: {type: MongooseSchema.Types.ObjectId, ref: 'User'},
            artisan: {type: MongooseSchema.Types.ObjectId, ref: 'Artisan'},
            location:  String,
            area1: String,
            area2: String,
            description: String,
            price: String,
            status: String,
            createdAt: String,
            now: Number,
            endAt: Number,
            active: Boolean

            
        })
        const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)
        return Job;
    }

}

export default Schema;