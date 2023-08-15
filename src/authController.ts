import {Request,Response} from 'express'
import {User} from "./models/User";
const jwt =  require("jsonwebtoken")

// Import the secret key.
import {secretKey} from "./config";

// Функция, которая возвращает ошибки описанные в authRouter
import {validationResult} from "express-validator";
import {Posts} from "./models/Posts";
import {userService} from "./service/user-service";


// import the bcrypt
const bcrypt = require('bcryptjs');

// Функция, которая создает JWT токен. Внутри объект который мы передаем с информацией в токен
const generateAccessToken = (id: string, roles: string) => {
    const payload = {
        id: id,
        roles: [roles]
    }
    return jwt.sign(payload, secretKey.accessToken, {expiresIn: '24h'}) // expiresIn - то, сколько будет жить токен
}


class AuthController {
    async registration(req: Request, res: Response) {
        try {
            // Получаем ошибки
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации.', errors})
            }

            // Return name and email and password from a body request
            const {username, email, password} = req.body
            const userData = await userService.registration(username, email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // httpOnly - защита куки, мы не можем обратиться к ней из браузера и получать

            return res.json({userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: `${e}`})
        }
    }

    async posts(req: Request, res: Response) {
        try {
            const { _id, message } = req.body
            const postData = await userService.posts(_id, message)

            return res.json({message: 'Пост был добавлен.'})
            /*return res.json({message: 'Сообщение было добавлено.'})*/
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Sorry it is error, the message could not be added.'})

        }
    }

    async login(req: Request, res: Response) {
          try {
            const email = req.body.email
            const password = req.body.password
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: `${e}`})
        }
    }

    async logout(req: Request, res: Response, next: any) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie(refreshToken)
            return res.json(token)

        } catch (e) {
            next(e)
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies
            if (!refreshToken) return res.status(400).json({message: 'Do not cookie.'})
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({userData})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Error refresh'})
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            /* Добавляем в базу данных только 1 раз. По идее проверка ниже не нужна.
            // Проверяем, существуют ли уже роли "USER" и "ADMIN" в базе данных
            const userRole = await Role.findOne({ value: 'USER' });
            const adminRole = await Role.findOne({ value: 'ADMIN' });

            // Если роли не существуют, то создаем их
            if (!userRole) {
                await new Role().save();
            }
            if (!adminRole) {
                await new Role({ value: 'ADMIN' }).save();
            }*/
            const users = await userService.getUsers()
            res.json(users);
        } catch (e) {
            res.json(`${e}`);
        }
    }

    async getUsername(req: Request, res: Response) {
        try {
            const {refreshToken} = req.cookies
            if (!refreshToken) return res.status(400).json({message: 'Do not cookie.'})
            const userData = await userService.getUsername(refreshToken)

            return res.json({userData})
        } catch (e) {
            console.log(e)
            res.json({message: `${e}`})
        }
    }
}

export const authController = new AuthController();
