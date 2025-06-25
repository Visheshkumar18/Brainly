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
const userSchema_1 = require("../models/userSchema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Unauthorized Access");
        }
        console.log("Authorization...");
        const decodedObj = jsonwebtoken_1.default.verify(token, "$!123!$");
        const { id } = decodedObj;
        const LoggedIN = yield userSchema_1.User.findById(id);
        if (!LoggedIN) {
            throw new Error("User not found");
        }
        req.user = LoggedIN;
        next();
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
});
exports.default = userAuth;
