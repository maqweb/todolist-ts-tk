import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums/common.enums";
import {
    AddTaskArgType,
    TasksType,
    todolistAPI,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/todolists-api";


const fetchTasks = createAppAsyncThunk<{ tasks: TasksType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistAPI.getTasks(todolistId)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTask = createAppAsyncThunk<{ task: TasksType }, AddTaskArgType>
('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        let res = await todolistAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            const task = res.data.data.item
            return {task}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const updateTaskModel = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/update',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            const state = getState()
            const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
            if (!task) {
                dispatch(appActions.setAppError({error: 'Task not found'}))
                return rejectWithValue(null)
            }

            const apiModel: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                ...arg.model
            }

            const res = await todolistAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return arg
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }

    })


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: ((state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTaskModel.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => state[tl.id] = [])
            })
            .addCase(clearData, () => {
                return {}
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksAction = slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTaskModel}


// thunks
export const removeTaskTC = (taskId: string, todolistId: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let deleteTask = await todolistAPI.deleteTask(todolistId, taskId)
    try {
        if (deleteTask.data.resultCode === 0) {
            dispatch(tasksAction.removeTask({taskId, todolistId}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(deleteTask.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

// types
export type TasksStateType = {
    [key: string]: Array<TasksType>
}


