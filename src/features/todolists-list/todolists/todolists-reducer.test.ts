import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsReducer,
    todolistsThunks,
} from "features/todolists-list/todolists/todolists-reducer";
import { v1 } from "uuid";
import { TodolistType } from "features/todolists-list/todolists-api";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
        { id: todolistId2, title: "What to repeat", filter: "all", order: 0, addedDate: "", entityStatus: "idle" },
    ];
});

test("correct Todolist should be removed", () => {
    const endState = todolistsReducer(startState, todolistsActions.removeTodolist({ id: todolistId1 }));
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test("correct Todolist should be added", () => {
    let newTodolist: TodolistType = { title: "New Todolist", addedDate: "", order: 0, id: todolistId1 };
    const endState = todolistsReducer(
        startState,
        todolistsThunks.createTodolist.fulfilled(newTodolist, "requestId", { title: "New Todolist" })
    );
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("New Todolist");
});

test("correct Todolist should change its name", () => {
    let newTodolistTitle = "New Todolist";
    const endState = todolistsReducer(
        startState,
        todolistsThunks.updateTodolistTitle.fulfilled(
            {
                todolistId: todolistId2,
                title: newTodolistTitle,
            },
            "requestId",
            { todolistId: todolistId2, title: newTodolistTitle }
        )
    );
    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of Todolist should be changed", () => {
    let newFilter: FilterValuesType = "completed";
    const endState = todolistsReducer(
        startState,
        todolistsActions.changeTodolistFilter({
            id: todolistId2,
            filter: newFilter,
        })
    );
    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
