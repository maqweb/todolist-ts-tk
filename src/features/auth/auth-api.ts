import { instance } from "common/api/common-api";
import { ResponseDataType } from "common/types";

export const authAPI = {
    login(data: LoginType) {
        return instance.post<ResponseDataType<{userId?: number}>>(`auth/login`, data)
    },
    logout() {
        return instance.delete<ResponseDataType>(`auth/login`)
    },
    me() {
        return  instance.get<ResponseDataType<{id: number, email: string, login: string}>>(`auth/me`)
    }
}

export type LoginType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: boolean
}