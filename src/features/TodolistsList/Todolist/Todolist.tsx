import React, {useCallback} from 'react'
import {AddItemForm} from 'common/components/AddItemForm/AddItemForm'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {FilterValuesType} from 'features/TodolistsList/todolists-reducer';
import {useDispatch} from "react-redux";
import {RequestStatusType} from "app/app-reducer";
import { EditableSpan } from "common/components";
import { TasksType } from "features/TodolistsList/todolists-api";
import { TaskStatuses } from "common/enums/common.enums";


type PropsType = {
    id: string
    title: string
    tasks: Array<TasksType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTaskCb: (title: string, todolistId: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTaskCb: (taskId: string, todolistId: string) => void
    removeTodolistCb: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: PropsType) {

    const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(fetchTasksTC(props.id))
    // }, [])

    console.log('Todolist called')
    const addTask = useCallback((title: string) => {
        props.addTaskCb(title, props.id)
    }, [props.addTaskCb, props.id])

    const removeTodolist = () => {
        props.removeTodolistCb(props.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title)
    }, [props.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.id, props.changeFilter])

    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => (
                    <Task
                        key={t.id}
                        task={t}
                        todolistId={props.id}
                        removeTaskCb={props.removeTaskCb}
                        changeTaskTitle={props.changeTaskTitle}
                        changeTaskStatus={props.changeTaskStatus}
                        entityStatus={props.entityStatus}
                    />
                ))
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


