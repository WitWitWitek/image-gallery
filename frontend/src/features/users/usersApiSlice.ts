import { apiSlice } from "../../app/api/apiSlice";

interface SignUpRequest {
    username: string,
    password: string,
    newPassword?: string,
}

interface SignUpResponse {
    message: string
    error?: {
        data: {
            message: string
        },
        status: number
    }
}

export const usersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['User']
        }),
        createNewUser: builder.mutation<SignUpResponse, SignUpRequest>({
            query: (credentials) => ({
                url: '/users',
                method: 'POST',
                body: {...credentials}
            }),
            invalidatesTags: ['User']
        }),
        changeUserPassword: builder.mutation<SignUpResponse, SignUpRequest>({
            query: (credentials) => ({
                url: '/users/change-password',
                method: 'PATCH',
                body: {...credentials}
            }),
            invalidatesTags: ['User']
        })
    })
})

export const {
    useGetUsersQuery,
    useCreateNewUserMutation,
    useChangeUserPasswordMutation
} = usersApi;