import { apiSlice } from "../../app/api/apiSlice";

interface SignUpRequest {
    username: string,
    password: string,
}

interface SignUpResponse {
    message: string
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
        })
    })
})

export const {
    useGetUsersQuery,
    useCreateNewUserMutation
} = usersApi;