import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearData } from "common/actions/common.actions";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authAPI, LoginType } from "features/Auth/auth-api";
import { ResultCode } from "common/enums";
import { createAppAsyncThunk } from "common/utils";


export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.login(arg)
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            dispatch(clearData())
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const initializeApp = createAppAsyncThunk<{isLoggedIn: boolean}, void>
('app/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            // handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setInitialized({initialized: true}))
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {login, logout, initializeApp}