import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {authActions} from "features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = any

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    initialized: false as boolean
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

// export const _appReducer = (state: InitialStateType = initialState, action: ApplicationActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-INITIALIZED':
//             return {...state, initialized: action.value}
//         default:
//             return state
//     }
// }

// actions
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppErrorAC = (error: ErrorType) => ({type: 'APP/SET-ERROR', error} as const)
// export const setInitializedAC = (value: boolean) => ({type: 'APP/SET-INITIALIZED', value} as const)

// types
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetInitializedActionType = ReturnType<typeof setInitializedAC>
// export type ApplicationActionsType =
//     | SetAppStatusActionType
//     | SetAppErrorActionType
//     | SetInitializedActionType