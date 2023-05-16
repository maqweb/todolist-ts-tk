import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "features/todolists-list/todolists/todolists-reducer";
import { clearData } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError } from "common/utils";
import { ResultCode } from "common/enums/common.enums";
import { thunkTryCatch } from "common/utils/thunk-try-catch";
import {
    AddTaskArgType,
    taskAPI,
    TasksType,
    UpdateTaskArgType,
    UpdateTaskModelType,
} from "features/todolists-list/tasks/tasks.api";

const fetchTasks = createAppAsyncThunk<{ tasks: TasksType[]; todolistId: string }, string>(
    "tasks/fetchTasks",
    async (todolistId, thunkAPI) => {
        const res = await taskAPI.getTasks(todolistId);
        return { todolistId, tasks: res.data.items };
    }
);

const addTask = createAppAsyncThunk<{ task: TasksType }, AddTaskArgType>(
    "tasks/addTask",
    async (arg, { rejectWithValue }) => {
        let res = await taskAPI.createTask(arg);
        if (res.data.resultCode === ResultCode.success) {
            const task = res.data.data.item;
            return { task };
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: false });
        }
    }
);

const removeTask = createAppAsyncThunk<any, { todolistId: string; taskId: string }>(
    "tasks/removeTask",
    async (arg, { rejectWithValue }) => {
        let res = await taskAPI.deleteTask(arg.todolistId, arg.taskId);
        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);

const updateTaskModel = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
    "tasks/update",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI;
        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            dispatch(appActions.setAppError({ error: "Task not found" }));
            return rejectWithValue(null);
        }

        const apiModel: UpdateTaskModelType = {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            ...arg.model,
        };

        const res = await taskAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);

const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(clearData, () => {
                return {};
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task);
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks.splice(index, 1);
            })
            .addCase(updateTaskModel.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
            })
            .addCase(todolistsThunks.createTodolist.fulfilled, (state, action) => {
                state[action.payload.id] = [];
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.forEach((tl: { id: string }) => {
                    state[tl.id] = [];
                });
            });
    },
});

export const tasksReducer = slice.reducer;
export const tasksAction = slice.actions;
export const tasksThunks = { fetchTasks, addTask, removeTask, updateTaskModel };

// types
export type TasksStateType = {
    [key: string]: Array<TasksType>;
};
