import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "features/TodolistsList/todolists-reducer";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError } from "common/utils";
import { ResultCode } from "common/enums/common.enums";
import {
    AddTaskArgType,
    TasksType,
    todolistAPI,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/todolists-api";
import { thunkTryCatch } from "common/utils/thunk-try-catch";


const fetchTasks = createAppAsyncThunk<{ tasks: TasksType[], todolistId: string }, string>
('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    return thunkTryCatch(thunkAPI, async () => {
        const res = await todolistAPI.getTasks(todolistId)
        return {todolistId, tasks: res.data.items}
    })
})

const addTask = createAppAsyncThunk<{ task: TasksType }, AddTaskArgType>
('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        let res = await todolistAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.success) {
            const task = res.data.data.item
            return {task}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

const removeTask = createAppAsyncThunk<any, { todolistId: string, taskId: string }>
('tasks/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
        let res = await todolistAPI.deleteTask(arg.todolistId, arg.taskId)
        if (res.data.resultCode === ResultCode.success) {
            return arg
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

const updateTaskModel = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/update',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
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
        })
    })


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(clearData, () => {
                return {}
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTaskModel.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
            })
            .addCase(todolistsThunks.createTodolist.fulfilled, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.forEach((tl: { id: string }) => {
                    state[tl.id] = []
                })
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksAction = slice.actions
export const tasksThunks = {fetchTasks, addTask, removeTask, updateTaskModel}


// types
export type TasksStateType = {
    [key: string]: Array<TasksType>
}


