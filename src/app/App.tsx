import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { TodolistsList } from "features/todolists-list/TodolistsList";
import { CircularProgress, LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "features/auth/Auth";
import { selectIsInitialized, selectIsLoggedIn, selectEntityStatus } from "app/app.selectors";
import { authThunks } from "features/auth/auth-reducer";
import { useActions } from "common/hooks";
import s from "./styles.module.css";
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import {Menu} from '@mui/icons-material';

function App() {
    const status = useSelector(selectEntityStatus);
    const isInitialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { logout, initializeApp } = useActions(authThunks);

    useEffect(() => {
        initializeApp({});
    }, []);

    const logoutHandler = () => logout({});

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "30%",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <CircularProgress />
            </div>
        );
    }
    return (
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <>
                        {/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
                        {/*    <Menu/>*/}
                        {/*</IconButton>*/}
                        {isLoggedIn && (
                            <Button color="inherit" onClick={logoutHandler}>
                                Log out
                            </Button>
                        )}
                    </>
                </Toolbar>
                <div className={s.lineProgress}>{status === "loading" && <LinearProgress />}</div>
            </AppBar>
            <Container fixed className={"container"}>
                <Routes>
                    <Route path={"/"} element={<TodolistsList />} />
                    <Route path={"/login"} element={<Auth />} />
                    <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path="*" element={<Navigate to={"/404"} />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
