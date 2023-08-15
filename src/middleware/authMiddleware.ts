import {secretKey} from "../config";
import {tokenService} from "../service/token-service";
const jwt = require('jsonwebtoken')

// Функция будет давать доступ только зарегистрированным пользователям
export function authMiddleware (req: any, res: any, next: any) {  // next - вызывает по цепочке следующий middleware
    if (req.method === 'OPTIONS') {            // Проверяем метод запроса. Исключаем OPTIONS
        next()
    }

    try {
        const authorizationToken = req.headers.authorization
        if (!authorizationToken) return next(res.status(401).json({message: 'Пользователь не авторизован!!'}))

        const accessToken = authorizationToken.split(' ')[1]   // Вытаскиваем токен из заголовка. Без его типа
        if (!accessToken) return res.status(401).json({message: 'Пользователь не авторизован!'})

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) return next(res.status(401).json({message: 'Пользователь не авторизован!'}))

        req.user = userData // Помещаем в request данные пользователя, которые вытащили из токена
        next()  // Передаем управление следующему Middleware
    } catch (e) {
        console.log(e)
        return res.status(401).json({message: 'Пользователь не авторизован!!'})
    }
}