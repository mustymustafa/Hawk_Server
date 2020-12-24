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
            country: String,
            email: String,
            phone: String,
            password: String,
            pushToken: String,
            confirmationCode: String,
            isConfirmed: Boolean,
            promo: { type: Boolean, default: false },
            next_promo: String,
            promo_date: String,
            createdAt: String,
            balance: Number
        });
        const User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
        return User;
    }
    static Transaction() {
        const TranSchema = new mongoose_1.default.Schema({
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            amount: Number,
            status: String,
            date: String
        });
        const Transaction = mongoose_1.default.models.Transaction || mongoose_1.default.model('Transaction', TranSchema);
        return Transaction;
    }
    static Transfers() {
        const TranSchema = new mongoose_1.default.Schema({
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            amount: Number,
            anumber: Number,
            bank: String,
            date: String
        });
        const Transfer = mongoose_1.default.models.Transfer || mongoose_1.default.model('Transfer', TranSchema);
        return Transfer;
    }
    static Artisan() {
        const ArtisanSchema = new mongoose_1.default.Schema({
            name: String,
            country: String,
            city: String,
            city2: String,
            email: String,
            phone: String,
            password: String,
            pic: String,
            bio: String,
            category: String,
            wage: Number,
            idCard: String,
            cert: String,
            mot: String,
            cac: String,
            id_expiry: String,
            vir: String,
            vl: String,
            vl_expiry: String,
            insurance: String,
            poo: String,
            vcolor: String,
            vmodel: String,
            vyear: String,
            plate: String,
            vpic: String,
            sname: String,
            sphone: String,
            lat: String,
            long: String,
            location: String,
            start: { type: Boolean, default: false },
            arrived: { type: Boolean, default: false },
            completed: { type: Number, default: 0 },
            rating: [Number],
            earnings: { type: Number, default: 0 },
            comments: [String],
            area1: String,
            area2: String,
            confirmationCode: String,
            pushToken: String,
            isConfirmed: Boolean,
            isActivated: Boolean,
            createdAt: String,
            expireAt: String,
            active: { type: Boolean, default: false }
        });
        const Artisan = mongoose_1.default.models.Artisan || mongoose_1.default.model('Artisan', ArtisanSchema);
        return Artisan;
    }
    static Job() {
        const JobSchema = new mongoose_1.default.Schema({
            category: String,
            pTime: String,
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            artisan: { type: MongooseSchema.Types.ObjectId, ref: 'Artisan' },
            artisan_name: String,
            location: String,
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
            distance: String,
            time: String,
            area1: String,
            area2: String,
            city: String,
            city2: String,
            description: String,
            price: String,
            paid: Boolean,
            status: String,
            createdAt: String,
            rated: Boolean,
            now: Number,
            active: Boolean
        });
        const Job = mongoose_1.default.models.Job || mongoose_1.default.model('Job', JobSchema);
        return Job;
    }
    static Emergency() {
        const EmergencySchema = new mongoose_1.default.Schema({
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            artisan: { type: MongooseSchema.Types.ObjectId, ref: 'Artisan' },
            location: String,
            lat: String,
            long: String,
            area1: String,
            area2: String,
            createdAt: { type: Date, default: Date.now },
        });
        const Emergency = mongoose_1.default.models.Emergency || mongoose_1.default.model('Emergency', EmergencySchema);
        return Emergency;
    }
}
exports.default = Schema;
