"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const config_1 = require("../config");
const jwt = require('jsonwebtoken');
// Функция будет давать доступ только зарегистрированным пользователям
function authMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') { // Проверяем метод запроса. Исключаем OPTIONS
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Вытаскиваем токен из заголовка. Без его типа
        if (!token)
            return res.status(403).json({ message: 'Пользователь не авторизован!' });
        const decodedData = jwt.verify(token, config_1.secretKey.secret); // Здесь находится пейлод с ид и ролями пользователя
        req.user = decodedData; // Создаем новое поле юзер и добавляем туда данные, чтобы можно было использовать данные в других функциях
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(403).json({ message: 'Пользователь не авторизован!!' });
    }
}
exports.authMiddleware = authMiddleware;
