import {createAction} from "@reduxjs/toolkit";
import {TodolistDomainType} from "features/TodolistsList/Todolist/todolists-reducer";
import {TasksStateType} from "features/TodolistsList/Todolist/Task/tasks-reducer";

export type ClearDataType = {
    tasks: TasksStateType
    todolists: TodolistDomainType[]
}

export const clearData = createAction('common/clear-data')