import {User} from "../models/User";
import {tokenService} from "./token-service"
// import the bcrypt
const bcrypt = require('bcryptjs');
const UserDto = require('../dtos/user-dto')

class UserService {
    async registration(username: string, email: string, password: string) {

        // Проверяем есть ли такой пользователь в базе данных
        const candidateEmail = await User.findOne({email})
        if (candidateEmail) {
            throw new Error(`This ${email} is already in use.`)
        }
        const hashPassword = bcrypt.hashSync(password, 7)

        // @ts-ignore
        const user = new User({username, email, password: hashPassword, message: []})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        await user.save()

        return { ...tokens, user: user }
    }

    async login(email: string, password: string) {
        const user = await User.findOne({email})

        if (!user) throw new Error(`User ${email} not found!`)

        // Сравниваем 2 пароля. Тот что хэшированный из базы данных и тот, что пришел из логинизации
        // @ts-ignore
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (!isPasswordCorrect) throw new Error(`Incorrect password!`)
        const userDto = new UserDto(user)

        //generated access token
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getUsers() {
        // Return message on client
        const users = await User.find()
        return {users}
    }

    async posts(_id: string, post: string) {
        const user = await User.findById(_id)
        if (!user) throw new Error('Что-то пошло не так.')

        // @ts-ignore
        const posts = user.posts.push(post)

        // @ts-ignore
        await user.save()

        return { user }

    }

    async logout(refreshToken: string) {
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) throw new Error(`Error tokens`)
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw new Error(`Ошибка авторизации!!`)
        }

        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)

        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getUsername(refreshToken: string) {
        if (!refreshToken) throw new Error(`Error tokens`)

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw new Error(`Ошибка авторизации!!`)
        }

        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        return{username: userDto.username}
    }
}

export const userService = new UserService()