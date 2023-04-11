import { BaseQueryFn, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store';
import { setCredentials, logOut } from '../../features/auth/authSlice';


const baseQuery = fetchBaseQuery({
    baseUrl: 'https://image-gallery-api-koys.onrender.com',
    credentials: "same-origin",
    mode: 'cors',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
            headers.set("Content-Type", "application/json");
        }
        return headers;
    }
})

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))

            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                (refreshResult.error.data as {message: string}).message = "Your login has expired. "
                api.dispatch(logOut())
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Image', 'User'],
    endpoints: (builder) => ({})
})
