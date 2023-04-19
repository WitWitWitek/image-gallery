import { apiSlice } from '../../app/api/apiSlice';

interface SignUpRequest {
  username: string,
  email?: string,
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

type ConfirmationRequest = string;
type ResendEmailRequest = string;

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createNewUser: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: '/users',
        method: 'POST',
        body: { ...credentials },
      }),
      invalidatesTags: ['User'],
    }),
    confirmUser: builder.mutation<SignUpResponse, ConfirmationRequest>({
      query: (emailToken) => ({
        url: `/users/confirmation/${emailToken}`,
        method: 'GET',
      }),
      invalidatesTags: ['User'],
    }),
    resendVerificationEmail: builder.mutation<SignUpResponse, ResendEmailRequest>({
      query: (email) => ({
        url: '/users/resend-email',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['User'],
    }),
    changeUserPassword: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: '/users/change-password',
        method: 'PATCH',
        body: { ...credentials },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateNewUserMutation,
  useConfirmUserMutation,
  useResendVerificationEmailMutation,
  useChangeUserPasswordMutation,
} = usersApi;
