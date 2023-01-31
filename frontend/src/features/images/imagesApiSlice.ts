import { apiSlice } from '../../app/api/apiSlice'

export const imagesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getImages: builder.query({
                query: () => '/images',
                providesTags: ['Image']
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