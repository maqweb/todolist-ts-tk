import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { FilterValuesType, TodolistDomainType } from "features/todolists-list/todolists/todolists-reducer";
import { TasksType } from "features/todolists-list/tasks/tasks.api";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/tasks-reducer";
import { FilterTasksButtons } from "features/todolists-list/todolists/Todolist/FilterTasksButtons/FilterTasksButtons";
import { Tasks } from "features/todolists-list/todolists/Todolist/Tasks/Tasks";
import { TodolistTitle } from "features/todolists-list/todolists/Todolist/TodolistTitle/TodolistTitle";

type PropsType = {
    todolist: TodolistDomainType;
    tasks: Array<TasksType>;
    changeFilter: (value: FilterValuesType, todolistId: string) => void;
};

export const Todolist: FC<PropsType> = memo(({ todolist, tasks }) => {
    const { addTask, fetchTasks } = useActions(tasksThunks);

    useEffect(() => {
        fetchTasks(todolist.id);
    }, []);

    const addTaskHandler = (title: string) => {
        return addTask({ title, todolistId: todolist.id }).unwrap();
    };

    return (
        <div>
            <TodolistTitle todolist={todolist} />
            <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
            <Tasks tasks={tasks} todolist={todolist} />
            <div style={{ paddingTop: "10px" }}>
                <FilterTasksButtons todolist={todolist} />
            </div>
        </div>
    );
});
