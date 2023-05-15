import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    initialized: false
}

export type AppInitialStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setInitialized: (state, action: PayloadAction<{initialized: boolean}>) => {
            state.initialized = action.payload.initialized
        }
    },
    extraReducers: builder => {
        builder
            .addMatcher((action) => {
                return action.type.endsWith('/pending')
            }, (state, action) => {
                state.status = 'loading'
            })
            .addMatcher((action) => {
                return action.type.endsWith('/rejected')
            }, (state, action) => {
                state.error = action.payload.messages[0]
                state.status = 'failed'
            })
            .addMatcher((action) => {
                return action.type.endsWith('/fulfilled')
            }, (state, action) => {
                state.status = 'succeeded'
            })
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions