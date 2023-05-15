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

}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}