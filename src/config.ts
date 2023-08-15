// Секретный ключ, для JWT токена. Он будет храниться на сервере. С его помощью мы будем расшифровывать токен, для авторизации.
interface SecretKey {
    accessToken: string
    refreshToken: string
}

export const secretKey: SecretKey = {
    accessToken: 'SECRET_ACCESS_TOKEN_KEY',
    refreshToken: 'SECRET_REFRESH_TOKEN_KEY'
}