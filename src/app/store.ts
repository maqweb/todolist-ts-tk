import {TasksActionsType, tasksReducer} from 'features/TodolistsList/Todolist/Task/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from 'features/TodolistsList/Todolist/todolists-reducer';
import {AnyAction, combineReducers} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {appReducer} from "./app-reducer";
import {authReducer} from "features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


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

// export const _store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppActionsType = TodolistsActionsType | TasksActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store;

