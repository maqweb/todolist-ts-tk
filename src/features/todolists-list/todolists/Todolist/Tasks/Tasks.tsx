import { Task } from "features/todolists-list/todolists/Todolist/Tasks/Task/Task";
import React, { FC } from "react";
import { TaskStatuses } from "common/enums";
import { TasksType } from "features/todolists-list/tasks/tasks.api";
import { TodolistDomainType } from "features/todolists-list/todolists/todolists-reducer";

type PropsType = {
    tasks: TasksType[];
    todolist: TodolistDomainType;
};

export const Tasks: FC<PropsType> = ({ tasks, todolist }) => {
    let tasksForTodolist = tasks;

    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }

    return (
        <>
            {tasksForTodolist.map((t) => (
                <Task key={t.id} task={t} todolistId={todolist.id} entityStatus={todolist.entityStatus} />
            ))}
        </>
    );
};
