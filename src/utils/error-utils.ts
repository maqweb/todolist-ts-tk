import {ResponseType} from 'api/todolist-api'
import {appActions} from "app/app-reducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: any) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: any) => {
    dispatch(appActions.setAppError({error: error.message}))
    dispatch(appActions.setAppStatus({status: 'failed'}))
}
