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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const authRouter_1 = require("./authRouter");
// const хранит значение port
const PORT = process.env.PORT || 5000;
// Created server
exports.app = (0, express_1.default)();
const httpServer = http_1.default.createServer(exports.app);
// Парсим JSON который будет приходить в запросах
exports.app.use(express_1.default.json());
// Это заголовки, чтобы снять кросс доменные ограничения
exports.app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
// Прослушивает router
exports.app.use('/auth', authRouter_1.authRouter);
// function starts server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // called function connect
        yield mongoose_1.default.connect(`mongodb+srv://max:qwe123@cluster0.7it1gui.mongodb.net/auth_roles?retryWrites=true&w=majority`);
        // Говорим - прослушивай этот порт и если успешно то console
        httpServer.listen(PORT, () => console.log(`server started on port ${PORT}`));
    }
    catch (e) {
        console.log(e);
    }
});
start();
