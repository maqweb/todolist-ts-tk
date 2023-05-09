type FieldErrorType = {
    error: string
    field: string
}

export type ResponseDataType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: FieldErrorType[]
    data: D
}
