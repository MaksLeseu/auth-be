import {secretKey} from "../config";
const jwt =  require("jsonwebtoken")
import {Token} from "../models/Token";

class TokenService {
    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, secretKey.accessToken, {expiresIn: '15s'})
        const refreshToken = jwt.sign(payload, secretKey.refreshToken, {expiresIn: '30d'})

        return { accessToken, refreshToken }
    }

    validateAccessToken(token: string) {
        try {
            return jwt.verify(token, secretKey.accessToken)
        } catch (e) {
            return null
        }
    }
    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, secretKey.refreshToken)
        } catch (e) {
            return null
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            // @ts-ignore
            tokenData.refreshToken = refreshToken;
            // @ts-ignore
            return tokenData.save()
        }
        // For database
        return await Token.create({user: userId, refreshToken})
    }

    async removeToken(refreshToken: string) {
        const tokenData = await Token.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken: string) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData
    }
}

export const tokenService = new TokenService()