import { EditableSpan } from "common/components";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import React, { FC, memo } from "react";
import { useActions } from "common/hooks";
import { TodolistDomainType, todolistsThunks } from "features/todolists-list/todolists/todolists-reducer";

type PropsType = {
    todolist: TodolistDomainType
}

export const TodolistTitle: FC<PropsType> = memo(({todolist}) => {
    const {removeTodolist, updateTodolistTitle} = useActions(todolistsThunks);
    const removeTodolistHandler = () => removeTodolist({todolistId: todolist.id})
    const changeTodolistTitle = (title: string) => updateTodolistTitle({todolistId: todolist.id, title})

    return (
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
    )
})