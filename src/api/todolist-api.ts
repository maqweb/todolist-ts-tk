import axios from 'axios'
import {TasksType, TodolistType, UpdateTaskModelType } from '../features/TodolistsList/Todolist/Task/tasks-reducer';
import exp from "constants";

const instance = axios.create({
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	withCredentials: true,
	headers: {
		'API-KEY': '6ab52400-1718-48c6-9e57-f24fa6232ed9'
	},
})

export const authAPI = {
	login(data: LoginType) {
		return instance.post<ResponseType<{userId?: number}>>(`auth/login`, data)
	},
	logout() {
		return instance.delete<ResponseType>(`auth/login`)
	},
	me() {
		return  instance.get<ResponseType<{id: number, email: string, login: string}>>(`auth/me`)
	}
}

// api
export const todolistAPI = {
	getTodolists() {
		return instance.get<Array<TodolistType>>(`todo-lists/`)
	},
	createTodolist(title: string) {
		return instance.post<ResponseType<{item: TodolistType}>>(`todo-lists/`, {title: title})
	},
	deleteTodolist(todolistId: string) {
		return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
	},
	updateTodolist(todolistId: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
	},
	getTasks(todolistId: string) {
		return instance.get<any>(`todo-lists/${todolistId}/tasks`)
	},
	createTask(arg: AddTaskArgType) {
		return instance.post<ResponseType<{item: TasksType}>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title})
	},
	deleteTask(todolistId: string, taskId: string) {
		return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
	},
	updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
		return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
	},
}

// types
export type LoginType = {
	email: string
	password: string
	rememberMe: boolean
	captcha?: boolean
}
export type ResponseType<D = {}> = {
	resultCode: number
	messages: Array<string>
	fieldsErrors: Array<string>
	data: D
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

