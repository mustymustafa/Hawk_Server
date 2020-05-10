"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema: MongooseSchema } = mongoose_1.default;
class Schema {
    static User() {
        const UserSchema = new mongoose_1.default.Schema({
            name: String,
            email: String,
            phone: String,
            password: String,
            pushToken: String,
            confirmationCode: String,
            isConfirmed: Boolean
        });
        const User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
        return User;
    }
    static Artisan() {
        const ArtisanSchema = new mongoose_1.default.Schema({
            name: String,
            email: String,
            phone: String,
            password: String,
            pic: String,
            bio: String,
            category: String,
            wage: Number,
            idCard: String,
            lat: String,
            long: String,
            location: String,
            complted: { type: Number, default: 0 },
            rating: [Number],
            comments: [String],
            area1: String,
            area2: String,
            confirmationCode: String,
            pushToken: String,
            isConfirmed: Boolean,
            isActivated: Boolean
        });
        const Artisan = mongoose_1.default.models.Artisan || mongoose_1.default.model('Artisan', ArtisanSchema);
        return Artisan;
    }
    static Job() {
        const JobSchema = new mongoose_1.default.Schema({
            category: String,
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            artisan: { type: MongooseSchema.Types.ObjectId, ref: 'Artisan' },
            location: String,
            area1: String,
            area2: String,
            description: String,
            price: String,
            status: String,
            createdAt: String,
            rated: Boolean,
            now: Number,
            endAt: Number,
            active: Boolean
        });
        const Job = mongoose_1.default.models.Job || mongoose_1.default.model('Job', JobSchema);
        return Job;
    }
}
exports.default = Schema;
