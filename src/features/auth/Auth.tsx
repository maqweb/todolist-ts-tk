import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormikHelpers, useFormik } from 'formik';
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { authThunks } from "features/auth/auth-reducer";
import { ResponseDataType } from "common/types";
import { LoginType } from "features/auth/auth-api";
import { useActions } from "common/hooks";


type FormikErrorType = Partial<Omit<LoginType, 'captcha'>>

const validate = (values: FormikErrorType) => {
    const errors: FormikErrorType = {}
    // if (!values.email) {
    //     errors.email = 'Required'
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    //     errors.email = 'Invalid email address'
    // }
    //
    // if (!values.password) {
    //     errors.password = 'Required'
    // } else if (values.password.length < 3) {
    //     errors.password = 'The password must be more than 3 characters'
    // }
    return errors
}

export const Auth = () => {

    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {login} = useActions(authThunks)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate,
        onSubmit: (values, formikHelpers: FormikHelpers<LoginType>) => {
            login(values)
                .unwrap()
                .catch((reason: ResponseDataType) => {
                    reason.fieldsErrors.forEach((fieldError) => {
                        formikHelpers.setFieldError(fieldError.field, fieldError.error)
                    })
                })
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            type={'email'}
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'} control={<Checkbox onChange={formik.handleChange}
                                                                                   checked={formik.values.rememberMe}
                                                                                   name={'rememberMe'}
                        />}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}