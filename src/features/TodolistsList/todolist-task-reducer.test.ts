import {addTodolistAC, TodolistDomainType, todolistsReducer} from './Todolist/todolists-reducer'
import {tasksReducer, TasksStateType, TodolistType} from './Todolist/Task/tasks-reducer'

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    let newTodolist: TodolistType = {title: 'new todolist', addedDate: '', order: 0, id: 'todolistId1' }
    const action = addTodolistAC(newTodolist)

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})

