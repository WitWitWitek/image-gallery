import { apiSlice } from '../../app/api/apiSlice'
import { logOut } from '../auth/authSlice'

export const imagesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getImages: builder.query({
                query: (page: number = 1) => `/images?page=${page}`,
                providesTags: ['Image'],
                async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                    try {
                        await queryFulfilled
                    } catch (err) {
                        dispatch(logOut())
                    }
                }   
            }),
        addNewImage: builder.mutation({
            query: (image) => ({
                url: '/images',
                method: 'POST',
                body: image
            }),
            invalidatesTags: ['Image']
        }),
        updateImage: builder.mutation({
            query: (image) => ({
                url: `/images/${image.imageId}`,
                method: 'PATCH',
                body: {
                    ...image
                }
            }),
            invalidatesTags: ['Image']
        }),
        deleteImage: builder.mutation({
            query: ({ id }) => ({
                url: `/images/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['Image']
        })
    })
})

export const { 
    useGetImagesQuery,
    useAddNewImageMutation,
    useUpdateImageMutation,
    useDeleteImageMutation
} = imagesApi;