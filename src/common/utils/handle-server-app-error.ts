import { appActions } from "app/app-reducer";
import { ResponseDataType } from "common/types";

export const handleServerAppError = <T>(data: ResponseDataType<T>, dispatch: any) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}