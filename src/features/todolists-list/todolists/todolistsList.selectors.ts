import { AppRootStateType } from "app/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const selectTodolists = (state: AppRootStateType) => state.todolists;
export const selectTasks = (state: AppRootStateType) => state.tasks;
