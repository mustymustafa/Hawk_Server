"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = __importDefault(require("./schema"));
const salt = bcrypt_1.default.genSaltSync(10);
const seedUser = () => __awaiter(void 0, void 0, void 0, function* () {
    yield schema_1.default.User().create({
        name: 'user',
        email: 'user@hawk.com',
        phone: '09038826995',
        password: bcrypt_1.default.hashSync('musty100', salt),
        isConfirmed: true,
    });
});
exports.seedArtisan = () => __awaiter(void 0, void 0, void 0, function* () {
    yield schema_1.default.Artisan().create({
        name: 'user',
        email: 'artisan@hawk.com',
        phone: '09038826995',
        password: bcrypt_1.default.hashSync('musty100', salt),
        isConfirmed: true,
        isActivated: true,
        pic: 'musty',
        identification: 'pic'
    });
});
exports.default = seedUser;
