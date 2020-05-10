"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    static validateEmail(email) {
        if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }
}
exports.default = Validator;
