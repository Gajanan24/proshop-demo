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
        }),
        initiateRazorpayPayment: builder.mutation({
            query: ({ orderId, amount }) => ({
              url: `${ORDERS_URL}/payment`, // Adjust the endpoint as per your backend
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: { orderId, amount },
            }),
        }),
        verifySignature : builder.mutation({
            query: (payload ) => ({
                url: `${ORDERS_URL}/validate`, // Adjust the endpoint as per your backend
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: payload,
            })     
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
              url: `${ORDERS_URL}/${orderId}/pay`,
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: details,
            }),
        }),
        getMyOrders: builder.query({
            query: () => ({
              url: `${ORDERS_URL}/mine`,
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }),
            keepUnusedDataFor: 5,
        }),
        getOrders : builder.query({
            query: () => ({
                url: `${ORDERS_URL}`,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
              }),
              keepUnusedDataFor: 5,
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
              url: `${ORDERS_URL}/${orderId}/deliver`,
              method: 'PUT',
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }),
        }),
        updateStock : builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/stock`,
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }),

        }),

    }),
});
export const { useCreateOrderMutation,
     useGetOrderDetailsQuery,
      useInitiateRazorpayPaymentMutation,
       useVerifySignatureMutation,
        usePayOrderMutation, 
        useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation,
        useUpdateStockMutation } = orderApiSlice
