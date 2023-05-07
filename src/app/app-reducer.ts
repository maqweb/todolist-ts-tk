import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/Auth/auth-reducer";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI } from "features/Auth/auth-api";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    initialized: false
}

export type AppInitialStateType = typeof initialState


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{error: string | null}>) => {
            state.error = action.payload.error
        },
        setInitialized: (state, action: PayloadAction<{initialized: boolean}>) => {
            state.initialized = action.payload.initialized
        }
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions

export const initializeAppTC = (): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let authMe = await authAPI.me()
    try {
        if (authMe.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
        } else {
            handleServerAppError(authMe.data, dispatch)
        }
        dispatch(appActions.setInitialized({initialized: true}))
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}