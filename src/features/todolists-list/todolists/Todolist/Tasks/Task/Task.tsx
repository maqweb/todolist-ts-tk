import React, { ChangeEvent, memo } from "react";
import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import { RequestStatusType } from "app/app-reducer";
import { useSelector } from "react-redux";
import { selectEntityStatus } from "features/todolists-list/tasks/task.selectors";
import { TaskStatuses } from "common/enums/common.enums";
import { EditableSpan } from "common/components";
import { TasksType } from "features/todolists-list/tasks/tasks.api";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/tasks-reducer";
import s from "features/todolists-list/todolists/Todolist/Tasks/Task/styles.module.css";

type TaskPropsType = {
    task: TasksType;
    todolistId: string;
    entityStatus: RequestStatusType;
};
export const Task: React.FC<TaskPropsType> = memo(({ task, todolistId }) => {
    const entityStatus = useSelector(selectEntityStatus);
    const { removeTask, updateTaskModel } = useActions(tasksThunks);

    const removeTaskHandler = () => removeTask({ taskId: task.id, todolistId: todolistId });
    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
        updateTaskModel({ todolistId: todolistId, taskId: task.id, model: { status: newIsDoneValue } });
    };
    const onChangeTitleTaskHandler = (title: string) => {
        updateTaskModel({ todolistId: todolistId, taskId: task.id, model: { title } });
    };

    return (
        <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeTaskStatusHandler}
                disabled={entityStatus === "loading"}
            />

            <EditableSpan
                value={task.title}
                onChange={onChangeTitleTaskHandler}
                disabled={entityStatus === "loading"}
            />
            <IconButton onClick={removeTaskHandler} disabled={entityStatus === "loading"}>
                <Delete />
            </IconButton>
        </div>
    );
});
