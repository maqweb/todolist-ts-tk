import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils";
import { todolistAPI, TodolistType } from "features/todolists-list/todolists-api";
import { ResultCode } from "common/enums";

const fetchTodolists = createAppAsyncThunk<TodolistType[], void>("todolists/fetchTodolist", async (arg, thunkAPI) => {
    const res = await todolistAPI.getTodolists();
    return res.data;
});

const createTodolist = createAppAsyncThunk<TodolistType, { title: string }>(
    "todolists/createTodolist",
    async (arg, { rejectWithValue }) => {
        let res = await todolistAPI.createTodolist(arg.title);
        if (res.data.resultCode === ResultCode.success) {
            return res.data.data.item;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: false });
        }
    }
);

const updateTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    "todolists/updateTodolistTitle",
    async (arg, { dispatch, rejectWithValue }) => {
        let res = await todolistAPI.updateTodolist(arg.todolistId, arg.title);
        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: "succeeded" }));
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
    "todolists/removeTodolist",
    async (arg, { rejectWithValue }) => {
        let res = await todolistAPI.deleteTodolist(arg.todolistId);
        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) state.splice(index, 1);
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id);
            if (todolist) todolist.filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (
            state,
            action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
        ) => {
            const todolist = state.find((todo) => todo.id === action.payload.todolistId);
            if (todolist) todolist.entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearData, () => {
                return [];
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.map((tl: any) => ({ ...tl, filter: "all", entityStatus: "idle" }));
            })
            .addCase(createTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload, entityStatus: "idle", filter: "all" });
            })
            .addCase(updateTodolistTitle.fulfilled, (state, action) => {
                const todolist = state.find((tl) => tl.id === action.payload.todolistId);
                if (todolist) todolist.title = action.payload.title;
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
                if (index !== -1) state.splice(index, 1);
            });
    },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, createTodolist, updateTodolistTitle, removeTodolist };

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
export type UpdateTodolistTitleArgType = {
    todolistId: string;
    title: string;
};
