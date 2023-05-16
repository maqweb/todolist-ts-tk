import { AppRootStateType } from "app/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectIsInitialized = (state: AppRootStateType) => state.app.initialized;
export const selectEntityStatus = (state: AppRootStateType) => state.app.status;
