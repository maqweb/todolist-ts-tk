import {tasksAction, tasksReducer, TasksStateType, TaskStatuses, TodolistType} from './tasks-reducer'
import {todolistsActions} from "features/TodolistsList/Todolist/todolists-reducer";

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '2', title: 'JS',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '3', title: 'React',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId2',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '2', title: 'milk',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId2',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '3', title: 'tea',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId2',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {
    const action = tasksAction.removeTask({taskId: '2', todolistId: 'todolistId2'})
    const endState = tasksReducer(startState, action)
    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '2', title: 'JS',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '3', title: 'React',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId1',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId2',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.New,
                startDate: '',
                todoListId: 'todolistId2',
                order: 0,
                deadline: '',
                addedDate: 0,
                completed: false,
                priority: 0,
                description: ''
            }
        ]
    })
})

test('correct task should be added to correct array', () => {
    const action = tasksAction.addTask({
        task: {
            id: '3',
            title: 'tea',
            status: TaskStatuses.New,
            startDate: '',
            todoListId: 'todolistId2',
            order: 0,
            deadline: '',
            addedDate: 0,
            completed: false,
            priority: 0,
            description: ''
        }
    })
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('tea')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    const action = tasksAction.updateTask({todolistId: 'todolistId2', taskId: '2', model: {status: 0}})
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId2'][2].status).toBe(TaskStatuses.New)
})

test('title task should be changed', () => {
    const action = tasksAction.updateTask({todolistId: 'todolistId2', taskId: '2', model: {title: 'orange'}})
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].title).toBe('orange')
})

test('new array should be added when new todolist is added', () => {
    let newTodolist: TodolistType = {title: 'new todolist', addedDate: '', order: 0, id: 'todolistId3' }
    const endState = tasksReducer(startState, todolistsActions.addTodolist({todolist: newTodolist}))
    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const action = todolistsActions.removeTodolist({id: 'todolistId2'})
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState)
    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})