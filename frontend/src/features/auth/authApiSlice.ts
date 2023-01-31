import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

interface LoginRequest {
    username: string
    password: string
  }

interface LoginResponse {
    accessToken: string
}

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: {...credentials}
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
        }}),
        refresh: builder.mutation({
                query: () => ({
                    url: '/auth/refresh',
                    method: 'GET',
                })
        }),
    })
})

export const {
    useLoginMutation,
    useRefreshMutation,
    useLogoutMutation
} = authApiSlice