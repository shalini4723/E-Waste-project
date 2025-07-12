import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_BASE_URL = 'http://localhost:5001';

export interface Brand {
  brand: string;
  models: string[];
}

interface Booking {
  [x: string]: any;
  _id?: string;
  userId: string;
  userEmail: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  facility: string;
  fullName: string;
  address: string;
  phone: string;
}

//------------------------------------Add-Addresses-APi----------------------------------------------------//

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getAddresses: builder.query<any[], void>({
      query: () => '/addresses',
    }),

    getAddressById: builder.query<any, string>({
      query: (id) => `/address/${id}`,
    }),

    createAddress: builder.mutation<any, any>({
      query: (addressData) => ({
        url: '/add-address',
        method: 'POST',
        body: addressData,
      }),
    }),

    updateAddress: builder.mutation<any, { id: string; addressData: any }>({
      query: ({ id, addressData }) => ({
        url: `/address/${id}`,
        method: 'PUT',
        body: addressData,
      }),
    }),

    deleteAddress: builder.mutation<any, string>({
      query: (id) => ({
        url: `/address/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});


//------------------------------------Create-Brands-APi----------------------------------------------------//

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => "/brands",
    }),
    getModelsByBrand: builder.query<string[], string>({
      query: (brand) => `/brands/${brand}`,
    }),
    addBrand: builder.mutation<Brand, Partial<Brand>>({
      query: (brand) => ({
        url: "/brands",
        method: "POST",
        body: brand,
      }),
    }),
  }),
});

//------------------------------------Laptop-APi----------------------------------------------------//

export const laptopbrandApi = createApi({
  reducerPath: "laptopbrandApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getlaptopBrands: builder.query<Brand[], void>({
      query: () => "/laptop-brands",
    }),
    getlaptopModelsByBrand: builder.query<string[], string>({
      query: (brand) => `/laptop-brands/${brand}`,
    }),
    addlaptopBrand: builder.mutation<Brand, Partial<Brand>>({
      query: (brand) => ({
        url: "/laptop-brands",
        method: "POST",
        body: brand,
      }),
    }),
  }),
});

//-------------------------------------accessories-APi----------------------------------------------------//

export const accessoriesBrandApi = createApi({
  reducerPath: "accessoriesBrandApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getAccessoriesBrands: builder.query<Brand[], void>({
      query: () => "/accessories-brands",
    }),
    getAccessoriesModelsByBrand: builder.query<string[], string>({
      query: (brand) => `/accessories-brands/${brand}`,
    }),
    addAccessoriesBrand: builder.mutation<Brand, Partial<Brand>>({
      query: (brand) => ({
        url: "/accessories-brands",
        method: "POST",
        body: brand,
      }),
    }),
  }),
});

//-------------------------------------television-APi----------------------------------------------------//

export const televisionBrandApi = createApi({
  reducerPath: "televisionBrandApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getTelevisionBrands: builder.query<Brand[], void>({
      query: () => "/television-brands",
    }),
    getTelevisionModelsByBrand: builder.query<string[], string>({
      query: (brand) => `/television-brands/${brand}`,
    }),
    addTelevisionBrand: builder.mutation<Brand, Partial<Brand>>({
      query: (brand) => ({
        url: "/television-brands",
        method: "POST",
        body: brand,
      }),
    }),
  }),
});

//-------------------------------------refrigerator-APi----------------------------------------------------//

export const refrigeratorBrandApi = createApi({
  reducerPath: "refrigeratorBrandApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getRefrigeratorBrands: builder.query<Brand[], void>({
      query: () => "/refrigerator-brands",
    }),
    getRefrigeratorModelsByBrand: builder.query<string[], string>({
      query: (brand) => `/refrigerator-brands/${brand}`,
    }),
    addRefrigeratorBrand: builder.mutation<Brand, Partial<Brand>>({
      query: (brand) => ({
        url: "/refrigerator-brands",
        method: "POST",
        body: brand,
      }),
    }),
  }),
});

//-------------------------------------approved-rejected-APi----------------------------------------------------//

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    createBooking: builder.mutation<any, any>({
      query: (newBooking) => ({
        url: "/create",
        method: "POST",
        body: newBooking,
      }),
    }),
    getBookings: builder.query<Booking[], void>({
      query: () => "/",
    }),
    getApprovedBookings: builder.query<Booking[], void>({
      query: () => "/bookings/approved",
    }),
    getRejectedBookings: builder.query<Booking[], void>({
      query: () => "/bookings/rejected",
    }),
    getTrashedBookings: builder.query<Booking[], void>({
      query: () => "/bookings/trashed",
    }),
    deleteBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    updateApprovalStatus: builder.mutation<any, { id: string; approvalStatus: "approved" | "rejected" | "trashed" }>({
      query: ({ id, approvalStatus }) => ({
        url: `/${id}/approval`,
        method: "PUT",
        body: { approvalStatus },
      }),
    }),
    restoreBooking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}/restore`,
        method: "PUT",
      }),
    }),
  }),
});


export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation } = addressApi;

export const {
  useGetBrandsQuery,
  useGetModelsByBrandQuery,
  useAddBrandMutation } = brandApi;

export const {
  useGetlaptopBrandsQuery,
  useGetlaptopModelsByBrandQuery,
  useAddlaptopBrandMutation } = laptopbrandApi;

export const {
  useGetAccessoriesBrandsQuery,
  useGetAccessoriesModelsByBrandQuery,
  useAddAccessoriesBrandMutation } = accessoriesBrandApi;

export const {
  useGetTelevisionBrandsQuery,
  useGetTelevisionModelsByBrandQuery,
  useAddTelevisionBrandMutation } = televisionBrandApi;

export const {
  useGetRefrigeratorBrandsQuery,
  useGetRefrigeratorModelsByBrandQuery,
  useAddRefrigeratorBrandMutation } = refrigeratorBrandApi;

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetApprovedBookingsQuery,
  useGetRejectedBookingsQuery,
  useGetTrashedBookingsQuery,
  useDeleteBookingMutation,
  useUpdateApprovalStatusMutation,
  useRestoreBookingMutation } = bookingApi;