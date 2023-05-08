import {
    TodolistDomainType,
    todolistsActions,
    todolistsReducer,
    todolistsThunks
} from 'features/TodolistsList/todolists-reducer'
import { tasksReducer, TasksStateType } from './Todolist/Task/tasks-reducer'
import { TodolistType } from "features/TodolistsList/todolists-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    let newTodolist: TodolistType = {title: 'new todolist', addedDate: '', order: 0, id: 'todolistId1'}
    const action = todolistsThunks.createTodolist.fulfilled(newTodolist, 'requestId', {title: 'new todolist'})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})

