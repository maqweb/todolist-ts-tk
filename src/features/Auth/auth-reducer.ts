import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {clearData} from "common/actions/common.actions";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authAPI, LoginType } from "features/Auth/auth-api";
import { ResultCode } from "common/enums";


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions


// thunks
export const loginTC = (data: LoginType): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let login = await authAPI.login(data)
    try {
        if (login.data.resultCode === ResultCode.success) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(login.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}


export const logoutTC = (): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let logout = await authAPI.logout()
    try {
        if (logout.data.resultCode === ResultCode.success) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            dispatch(clearData())
        } else {
            handleServerAppError(logout.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}