import express, {Application} from 'express'
import mongoose from 'mongoose'
import http from "http";
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {authRouter} from "./authRouter";




// const хранит значение port
const PORT = process.env.PORT || 5000;

// Created server
export const app: Application = express();
const httpServer: http.Server = http.createServer(app);

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'

}))

// Парсим JSON который будет приходить в запросах
app.use(express.json());


app.use(cookieParser())

// Прослушивает router
app.use('/auth/jwt', authRouter);

// function starts server
const start = async () => {
    try {
        // called function connect
        await mongoose.connect(`mongodb+srv://user:1234@clustertokens.iryh7jw.mongodb.net/database-with-jwt-tokens?retryWrites=true&w=majority`);

        // Говорим - прослушивай этот порт и если успешно то console
        httpServer.listen(PORT, () => console.log(`server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};
start();
