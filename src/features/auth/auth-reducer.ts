import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearData } from "common/actions/common.actions";
import { handleServerAppError } from "common/utils/handle-server-app-error";
import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { authAPI, LoginType } from "features/auth/auth-api";
import { ResultCode } from "common/enums";
import { createAppAsyncThunk } from "common/utils";
import { thunkTryCatch } from "common/utils/thunk-try-catch";

export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>(
    "auth/login",
    async (arg, { rejectWithValue }) => {
        let res = await authAPI.login(arg);
        if (res.data.resultCode === ResultCode.success) {
            return { isLoggedIn: true };
        } else {
            const isShowAppError = !res.data.fieldsErrors.length;
            return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
        }
    }
);

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
    "auth/logout",
    async (arg, { dispatch, rejectWithValue }) => {
        let res = await authAPI.logout();
        if (res.data.resultCode === ResultCode.success) {
            dispatch(clearData());
            return { isLoggedIn: false };
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: false });
        }
    }
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("app/initializeApp", async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
        let res = await authAPI.me();
        if (res.data.resultCode === ResultCode.success) {
            return { isLoggedIn: true };
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: false });
        }
    } finally {
        dispatch(appActions.setInitialized({ initialized: true }));
    }
});

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn;
            });
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, initializeApp };
