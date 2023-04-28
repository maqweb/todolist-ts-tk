import {
    FilterValuesType,
    TodolistDomainType, todolistsActions,
    todolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid'
import {TodolistType} from './Task/tasks-reducer'


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: "idle"},
        {id: todolistId2, title: 'What to repeat', filter: 'all', order: 0, addedDate: '', entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, todolistsActions.removeTodolist({id: todolistId1}))
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let newTodolistTitle = 'New Todolist'
    let newTodolist: TodolistType = {title: newTodolistTitle, addedDate: '', order: 0, id: todolistId1}
    const endState = todolistsReducer(startState, todolistsActions.addTodolist({todolist: newTodolist}))
    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'
    const endState = todolistsReducer(startState, todolistsActions.changeTodolistTitle({
        id: todolistId2,
        title: newTodolistTitle
    }))
    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed'
    const endState = todolistsReducer(startState, todolistsActions.changeTodolistFilter({
        id: todolistId2,
        filter: newFilter
    }))
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

