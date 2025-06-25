"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importStar(require("express"));
const userSchema_1 = require("./models/userSchema");
const contentSchema_1 = require("./models/contentSchema");
const database_1 = __importDefault(require("./config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = __importDefault(require("./Middleware/authMiddleware"));
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cookie_parser_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            res.status(403).send("Invalid userName and Password");
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield userSchema_1.User.create({
            userName: userName,
            password: hashPassword
        });
        user.save();
        res.json({ message: "User Signup successfully!" });
    }
    catch (err) {
        res.status(403).json({ message: err });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            res.status(403).send("Invalid userName and Password");
            return;
        }
        const isValidUser = yield userSchema_1.User.findOne({ userName });
        if (!isValidUser) {
            throw new Error("Something went wrong!");
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, isValidUser.password);
        if (!isValidPassword) {
            throw new Error("something went wrong!");
        }
        const token = jsonwebtoken_1.default.sign({ id: isValidUser._id }, "$!123!$");
        res.cookie("token", token);
        res.json({ message: `${userName} Signin successfully!` });
    }
    catch (err) {
        res.status(403).json({ message: err.message });
    }
}));
app.post("/content", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const link = req.body.link;
    const type = req.body.type;
    yield contentSchema_1.Content.create({
        link: link,
        type: type,
        tags: [],
        userId: req.user.id
    });
    res.json({ message: "Content is Saved " });
}));
app.get("/content", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const content = yield contentSchema_1.Content.find({ userId });
        res.json(content);
        return;
    }
    catch (err) {
        res.json({ message: err.message });
        return;
    }
}));
app.delete("/content", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentID = req.body.contentID;
    const userID = req.user._id;
    yield contentSchema_1.Content.deleteOne({
        _id: contentID,
        userId: userID
    });
    res.json({ message: "Deleted" });
}));
(0, database_1.default)().then(() => {
    console.log("Database connection is Established!!");
    app.listen(3000, () => { console.log("server is listen on port 3000"); });
});
