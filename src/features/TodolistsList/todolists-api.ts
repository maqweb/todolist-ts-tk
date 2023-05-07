import { instance, } from "common/api/common-api";
import { TaskPriorities, TaskStatuses } from "common/enums/common.enums";
import { RequestStatusType } from "app/app-reducer";
import { ResponseDataType } from "common/types";

export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>(`todo-lists/`)
    },
    createTodolist(title: string) {
        return instance.post<ResponseDataType<{item: TodolistType}>>(`todo-lists/`, {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseDataType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseDataType>(`todo-lists/${todolistId}`, {title: title})
    },
    getTasks(todolistId: string) {
        return instance.get<any>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<ResponseDataType<{item: TasksType}>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseDataType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseDataType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
}

export type AddTaskArgType = {
    title: string
    todolistId: string
}
export type UpdateTaskArgType = {
    todolistId: string
    taskId: string
    model: UpdateTaskModelType
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