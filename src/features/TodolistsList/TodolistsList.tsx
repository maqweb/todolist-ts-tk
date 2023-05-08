import React, { useCallback, useEffect } from "react";
import { FilterValuesType, todolistsActions, todolistsThunks, } from "features/TodolistsList/todolists-reducer";
import { useSelector } from "react-redux";
import { tasksThunks, } from "./Todolist/Task/tasks-reducer";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components";
import Paper from "@mui/material/Paper";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enums";
import { selectIsLoggedIn, selectTasks, selectTodolists } from "features/TodolistsList/todolistsList.selectors";

export const TodolistsList: React.FC = () => {

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }

        dispatch(todolistsThunks.fetchTodolists({}))
    }, [])

    const isLoggedIn = useSelector(selectIsLoggedIn)
    const todolists = useSelector(selectTodolists)
    const tasks = useSelector(selectTasks)
    const dispatch = useAppDispatch();

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(tasksThunks.removeTask({todolistId, taskId}));
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
    const removeTodolist = useCallback(function (todolistId: string) {
        dispatch(todolistsThunks.removeTodolist({todolistId}))
    }, []);
    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        dispatch(todolistsThunks.updateTodolistTitle({todolistId, title}));
    }, []);
    const addTodolist = useCallback((title: string) => {
        dispatch(todolistsThunks.createTodolist({title}))
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