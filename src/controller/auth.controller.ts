import { Request, Response } from "express"
import bcrypt from 'bcrypt'

import { findUser, saveUser } from "../model/user.model.js"
import { responseHandler } from "../responseHandler/index.js"

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, gender, password } = req.body
        const user = await findUser(email)
        if (user) {
            return responseHandler.invalidRequest(res, `this email id is already used`)
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const data = {
            name: name,
            email: email,
            gender: gender,
            password: hashPassword
        }
        const userData = await saveUser(data)
        return res.status(201)
            .send({ status: true, message: 'user created' })
    } catch (error) {
        return responseHandler.serverError(res, (error as Error))
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await findUser(email)
        if (!user) {
            responseHandler.notFound(res, `user not registered`)
        }
        if (user && user.password) {
            const verifyPass = await bcrypt.compare(password, user.password)
            if (!verifyPass) {
                return responseHandler.handleInvalidData(res, `password not valid`)
            }
        }
    } catch (error) {
        return responseHandler.serverError(res, (error as Error))
    }
}