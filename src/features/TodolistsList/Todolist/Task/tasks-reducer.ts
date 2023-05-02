import {todolistAPI} from "api/todolist-api";
import {AppRootStateType} from "app/store";
import {appActions, RequestStatusType} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "features/TodolistsList/Todolist/todolists-reducer";
import {clearData} from "common/common.actions";


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
        addTask: ((state, action: PayloadAction<{ task: TasksType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        }),
        setTasks: ((state, action: PayloadAction<{ todolistId: string, tasks: Array<TasksType> }>) => {
            state[action.payload.todolistId] = action.payload.tasks
        }),
        updateTask: ((state, action: PayloadAction<{ todolistId: string, taskId: string, model: UpdateTaskModelType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
        }),

    },
    extraReducers: (builder) => {
        builder
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


// thunks
export const fetchTasksTC = (todolistId: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let getTasks = await todolistAPI.getTasks(todolistId)
    try {
        dispatch(tasksAction.setTasks({todolistId, tasks: getTasks.data.items}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
export const addTaskTC = (todolistId: string, title: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let createTask = await todolistAPI.createTask(todolistId, title)
    try {
        if (createTask.data.resultCode === 0) {
            const task = createTask.data.data.item
            dispatch(tasksAction.addTask({task}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(createTask.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}
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
export const updateTaskModelTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): any =>
    async (dispatch: any, getState: () => AppRootStateType) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const state = getState()
        const tasksForCurrentTodolist = state.tasks[todolistId]
        const task = tasksForCurrentTodolist.find(t => t.id === taskId)

        if (!task) {
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            ...model
        }
        if (task) {
            let updateTask = await todolistAPI.updateTask(todolistId, taskId, apiModel)
            try {
                if (updateTask.data.resultCode === 0) {
                    dispatch(tasksAction.updateTask({todolistId, taskId, model}))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(updateTask.data, dispatch)
                }
            } catch (e: any) {
                handleServerNetworkError(e, dispatch)
            }
        }
    }

// types
export type TasksStateType = {
    [key: string]: Array<TasksType>
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type UpdateTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TasksType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: number
    entityStatus?: RequestStatusType
}


