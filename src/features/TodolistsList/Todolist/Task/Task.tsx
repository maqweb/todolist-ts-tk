import React, {ChangeEvent, useCallback} from 'react'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import EditableSpan from 'components/EditableSpan/EditableSpan';
import {RequestStatusType} from "app/app-reducer";
import { TaskStatuses, TasksType } from './tasks-reducer';
import {useSelector} from "react-redux";
import { selectEntityStatus } from './task.selectors';

type TaskPropsType = {
    task: TasksType
    todolistId: string
    changeTaskStatus: ( todolistId: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    entityStatus: RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {
    const entityStatus = useSelector(selectEntityStatus)
    const onClickHandler = useCallback(() => {
        props.removeTask(props.task.id, props.todolistId)
    }, [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        props.changeTaskStatus(props.todolistId, props.task.id, newIsDoneValue)
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.todolistId, props.task.id, newValue)
    }, [props.task.id, props.todolistId]);

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
            disabled={entityStatus === 'loading'}
        />

        <EditableSpan
            value={props.task.title}
            onChange={onTitleChangeHandler}
            disabled={entityStatus === 'loading'}
        />
        <IconButton onClick={onClickHandler} disabled={entityStatus === 'loading'}>
            <Delete/>
        </IconButton>
    </div>
})
