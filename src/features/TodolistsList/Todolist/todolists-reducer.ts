import { todolistAPI } from "api/todolist-api";
import {
    appActions,
    RequestStatusType,
} from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { tasksThunks, TodolistType } from "./Task/tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/common.actions";


const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({ ...tl, filter: 'all', entityStatus: "idle" }))
        },
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({ ...action.payload.todolist, entityStatus: 'idle', filter: 'all' })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) todolist.title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.id)
            if (todolist) todolist.filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) => {
            const todolist = state.find(todo => todo.id === action.payload.todolistId)
            if (todolist) todolist.entityStatus = action.payload.status
        },
        // clearData: (() => {
        //     return []
        // })
    },
    extraReducers: builder => {
        builder
            .addCase(clearData, () => {
                return []
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistTC = (): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(todolistsActions.setTodolists({ todolists: res.data }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return res.data
        })
        .then(todolists => {
            todolists.forEach((tl) => {
                dispatch(tasksThunks.fetchTasks(tl.id))
            })
        })
}
export const removeTodolistTC = (todolistId: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: 'loading' }))
    let deleteTodolist = await todolistAPI.deleteTodolist(todolistId)
    try {
        if (deleteTodolist.data.resultCode === 0) {
            dispatch(todolistsActions.removeTodolist({ id: todolistId }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        } else {
            handleServerAppError(deleteTodolist.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
export const createTodolistTC = (title: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    let createTodolist = await todolistAPI.createTodolist(title)
    try {
        if (createTodolist.data.resultCode === 0) {
            const todolist = createTodolist.data.data.item
            dispatch(todolistsActions.addTodolist({ todolist }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        } else {
            handleServerAppError(createTodolist.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
export const updateTodolistTitleTC = (todolistId: string, title: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    let updateTodolist = await todolistAPI.updateTodolist(todolistId, title)
    try {
        if (updateTodolist.data.resultCode === 0) {
            dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        } else {
            handleServerAppError(updateTodolist.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

