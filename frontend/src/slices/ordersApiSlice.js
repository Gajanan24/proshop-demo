import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url:ORDERS_URL,
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: { ...order }
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),
            keepUnusedDataFor : 5
        })
    }),
});
export const { useCreateOrderMutation, useGetOrderDetailsQuery } = orderApiSlice
