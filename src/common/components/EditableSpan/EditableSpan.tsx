import React, { ChangeEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { RequestStatusType } from "app/app-reducer";

type EditableSpanPropsType = {
    value: string;
    onChange: (newValue: string) => void;
    disabled?: boolean;
};

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
    console.log("EditableSpan called");
    const entityStatus = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status);

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    };
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    };
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    return editMode && entityStatus !== "loading" ? (
        <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
    ) : (
        <span onDoubleClick={activateEditMode}>{props.value}</span>
    );
});
