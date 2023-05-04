import { tasksReducer } from 'features/TodolistsList/Todolist/Task/tasks-reducer';
import { todolistsReducer } from 'features/TodolistsList/Todolist/todolists-reducer';
import { AnyAction, combineReducers } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { appReducer } from "./app-reducer";
import { authReducer } from "features/Auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;

