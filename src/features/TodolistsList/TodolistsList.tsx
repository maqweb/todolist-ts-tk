import React, { useCallback, useEffect } from "react";
import { FilterValuesType, todolistsActions, todolistsThunks, } from "features/TodolistsList/todolists-reducer";
import { useSelector } from "react-redux";
import { tasksThunks, } from "./Todolist/Task/tasks-reducer";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { TaskStatuses } from "common/enums";
import { selectIsLoggedIn, selectTasks, selectTodolists } from "features/TodolistsList/todolistsList.selectors";
import { useActions } from "common/hooks";

export const TodolistsList: React.FC = () => {

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        fetchTodolists()
    }, [])

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const {
        removeTodolist,
        updateTodolistTitle,
        createTodolist,
        fetchTodolists
    } = useActions(todolistsThunks);
    const {removeTask, updateTaskModel, addTask} = useActions(tasksThunks)
    const {changeTodolistFilter} = useActions(todolistsActions)

    const removeTaskCb = useCallback(function (taskId: string, todolistId: string) {
        removeTask({todolistId, taskId});
    }, []);
    const addTaskCb = useCallback(function (title: string, todolistId: string) {
        addTask({title, todolistId});
    }, []);
    const changeStatus = useCallback(function (todolistId: string, taskId: string, status: TaskStatuses,) {
        updateTaskModel({todolistId, taskId, model: {status}});
    }, []);
    const changeTaskTitle = useCallback(function (todolistId: string, taskId: string, title: string,) {
        updateTaskModel({todolistId, taskId, model: {title}});
    }, []);
    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        changeTodolistFilter({id: todolistId, filter});
    }, []);
    const removeTodolistCb = useCallback(function (todolistId: string) {
        removeTodolist({todolistId})
    }, []);
    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        updateTodolistTitle({todolistId, title});
    }, []);
    const addTodolist = useCallback((title: string) => {
        createTodolist({title})
    }, []);

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={allTodolistTasks}
                                removeTaskCb={removeTaskCb}
                                changeFilter={changeFilter}
                                addTaskCb={addTaskCb}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolistCb={removeTodolistCb}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                entityStatus={tl.entityStatus}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}