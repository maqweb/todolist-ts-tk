import React, { FC, useCallback, useEffect } from "react";
import {
    FilterValuesType,
    todolistsActions,
    todolistsThunks,
} from "features/todolists-list/todolists/todolists-reducer";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { AddItemForm } from "common/components";
import Paper from "@mui/material/Paper";
import { Todolist } from "features/todolists-list/todolists/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import {
    selectIsLoggedIn,
    selectTasks,
    selectTodolists,
} from "features/todolists-list/todolists/todolistsList.selectors";
import { useActions } from "common/hooks";
import s from "./styles.module.css";

export const TodolistsList: FC = () => {
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTodolists({});
    }, []);

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const todolists = useSelector(selectTodolists);
    const tasks = useSelector(selectTasks);

    const { createTodolist, fetchTodolists } = useActions(todolistsThunks);
    const { changeTodolistFilter } = useActions(todolistsActions);

    const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
        changeTodolistFilter({ id: todolistId, filter });
    }, []);

    const addTodolistHandler = useCallback((title: string) => {
        return createTodolist({ title }).unwrap();
    }, []);

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />;
    }

    return (
        <>
            <Grid container style={{ padding: "20px" }}>
                <AddItemForm addItem={addTodolistHandler} />
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id];

                    return (
                        <Grid item key={tl.id}>
                            <Paper className={s.paper}>
                                <Todolist todolist={tl} tasks={allTodolistTasks} changeFilter={changeFilter} />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
