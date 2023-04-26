import {AddTodolistActionType, RemoveTodolistActionType} from '../todolists-reducer';
import {todolistAPI} from "api/todolist-api";
import {Dispatch} from 'redux';
import {AppRootStateType} from "app/store";
import {appActions, RequestStatusType} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state;
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TasksType) =>
    ({type: 'ADD-TASK', task} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const setTasksAC = (todolistId: string, tasks: Array<TasksType>) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateTaskModelType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, model} as const)


// thunks
export const fetchTasksTC = (todolistId: string): any => async (dispatch: any) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    let getTasks = await todolistAPI.getTasks(todolistId)
    try {
        dispatch(setTasksAC(todolistId, getTasks.data.items))
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
            dispatch(addTaskAC(task))
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
            dispatch(removeTaskAC(taskId, todolistId))
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
                    dispatch(updateTaskAC(todolistId, taskId, model))
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


export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof updateTaskAC>


