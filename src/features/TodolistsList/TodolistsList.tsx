import React, { useCallback, useEffect } from "react";
import {
    createTodolistTC,
    fetchTodolistTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    todolistsActions,
    updateTodolistTitleTC
} from "features/TodolistsList/todolists-reducer";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { removeTaskTC, TasksStateType, tasksThunks, } from "./Todolist/Task/tasks-reducer";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enums";

export const TodolistsList: React.FC = () => {

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        dispatch(fetchTodolistTC())
    }, [])

    const isLoggedIn = useSelector<AppRootStateType>(state => state.auth.isLoggedIn)
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useAppDispatch();

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(removeTaskTC(id, todolistId));
    }, []);
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({title, todolistId}));
    }, []);
    const changeStatus = useCallback(function (todolistId: string, taskId: string, status: TaskStatuses,) {
        dispatch(tasksThunks.updateTaskModel({todolistId, taskId, model: {status}}));
    }, []);
    const changeTaskTitle = useCallback(function (todolistId: string, taskId: string, title: string,) {
        dispatch(tasksThunks.updateTaskModel({todolistId, taskId, model: {title}}));
    }, []);
    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        dispatch(todolistsActions.changeTodolistFilter({id: todolistId, filter}));
    }, []);
    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);
    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        dispatch(updateTodolistTitleTC(todolistId, title));
    }, []);
    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch]);

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
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
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