import mongoose from 'mongoose';
const {Schema: MongooseSchema} = mongoose;

class Schema {
    static User() {
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            phone: String,
            password: String,
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
            confirmationCode: String,
            isConfirmed: Boolean,
            isActivated: Boolean

        })
        const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema)
        return Artisan;
    }


}

export default Schema;