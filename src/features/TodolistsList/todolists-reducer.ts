import { appActions, RequestStatusType, } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistAPI, TodolistType } from "features/TodolistsList/todolists-api";
import { tasksThunks } from "features/TodolistsList/Todolist/Task/tasks-reducer";

const fetchTodolists = createAppAsyncThunk<{todolists: TodolistType[]}, {}>
('todolists/fetchTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        res.data.forEach(tl => {
            dispatch(tasksThunks.fetchTasks(tl.id))
        })
        return {todolists: res.data}
    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
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
    },
    extraReducers: builder => {
        builder
            .addCase(clearData, () => {
                return []
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl: any) => ({ ...tl, filter: 'all', entityStatus: "idle" }))
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists}

// thunks

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

