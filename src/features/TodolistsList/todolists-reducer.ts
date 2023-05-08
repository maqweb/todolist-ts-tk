import { appActions, RequestStatusType, } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistAPI, TodolistType } from "features/TodolistsList/todolists-api";
import { tasksThunks } from "features/TodolistsList/Todolist/Task/tasks-reducer";
import { ResultCode } from "common/enums";
import { ResponseDataType } from "common/types";

const fetchTodolists = createAppAsyncThunk<TodolistType[], {}>
('todolists/fetchTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        res.data.forEach(tl => {
            dispatch(tasksThunks.fetchTasks(tl.id))
        })
        return res.data
    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const createTodolist = createAppAsyncThunk<TodolistType, {title: string}>
('todolists/createTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        let res = await todolistAPI.createTodolist(arg.title)
        if (res.data.resultCode === ResultCode.success) {
            const todolist = res.data.data.item
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return todolist
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const updateTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>
('todolists/updateTodolistTitle', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        let res = await todolistAPI.updateTodolist(arg.todolistId, arg.title)
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return arg
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTodolist = createAppAsyncThunk<{todolistId: string}, {todolistId: string}>
('todolists/removeTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId: arg.todolistId, status: 'loading' }))
        let res = await todolistAPI.deleteTodolist(arg.todolistId)
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return arg
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
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
                return action.payload.map((tl: any) => ({ ...tl, filter: 'all', entityStatus: "idle" }))
            })
            .addCase(createTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload, entityStatus: 'idle', filter: 'all' })
            })
            .addCase(updateTodolistTitle.fulfilled, (state, action) => {
                const todolist = state.find(tl => tl.id === action.payload.todolistId)
                if (todolist) todolist.title = action.payload.title
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists, createTodolist, updateTodolistTitle, removeTodolist}

// thunks

// export const _removeTodolistTC = (todolistId: string): any => async (dispatch: any) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }))
//     dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, status: 'loading' }))
//     let deleteTodolist = await todolistAPI.deleteTodolist(todolistId)
//     try {
//         if (deleteTodolist.data.resultCode === 0) {
//             dispatch(todolistsActions.removeTodolist({ id: todolistId }))
//             dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//         } else {
//             handleServerAppError(deleteTodolist.data, dispatch)
//         }
//     } catch (e: any) {
//         handleServerNetworkError(e, dispatch)
//     }
// }
// export const _updateTodolistTitleTC = (todolistId: string, title: string): any => async (dispatch: any) => {
//     dispatch(appActions.setAppStatus({ status: 'loading' }))
//     let updateTodolist = await todolistAPI.updateTodolist(todolistId, title)
//     try {
//         if (updateTodolist.data.resultCode === 0) {
//             dispatch(todolistsActions.changeTodolistTitle({ id: todolistId, title }))
//             dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//         } else {
//             handleServerAppError(updateTodolist.data, dispatch)
//         }
//     } catch (e: any) {
//         handleServerNetworkError(e, dispatch)
//     }
// }

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type UpdateTodolistTitleArgType = {
    todolistId: string
    title: string
}

