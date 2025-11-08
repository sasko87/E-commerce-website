import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../components/lib/axios";
import { useMemo } from "react";

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  loading: false,
  gender: null,
  category: null,
  sort: null,
  orders: [],

  setProducts: (products) => set({ products }),
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
      }));
      set({ loading: false });
      toast.success("Product created");
    } catch (error) {
      set({ loading: false });
      toast.error(error.res?.data?.error || error.message);
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.res?.data?.error || error.message);
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${id}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.res?.data?.error || error.message);
    }
  },
  toggleFeaturedProduct: async (productId) => {
    try {
      const res = await axios.patch(`/products/${productId}`);
      const newIsFeatured = res.data?.isFeatured;

      set((state) => {
        // Always create a new array so React re-renders
        const updatedProducts = state.products.map((p) =>
          p._id === productId
            ? { ...p, isFeatured: newIsFeatured ?? !p.isFeatured }
            : p
        );
        return { products: updatedProducts };
      });

      toast.success("Product updated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });

    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
    }
  },
  updateProduct: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/products/${id}`, updatedData);

      // Replace updated product in array
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? res.data : p)),
        loading: false,
      }));
      toast.success("Product updated");
    } catch (error) {
      console.error("Error updating product:", error);
      set({ loading: false });
      toast.error(error.message);
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ featuredProducts: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      console.log("featured posts", error);
    }
  },

  setCategory: (category) => set({ category }),
  setGender: (gender) => set({ gender }),
  setSort: (sort) => set({ sort }),

  getPayload: () => {
    const { category, gender, sort } = get();
    const query = { onSale: true };
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (sort) query.sort = sort;
    return query;
  },

  fetchProductsOnSale: async () => {
    const payload = get().getPayload();
    try {
      const res = await axios.get(
        "/products/on-sale?" + new URLSearchParams(payload).toString()
      );
      set({ products: res.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/payments/get-all-orders");

      // ✅ Always check that response.data exists
      if (!response?.data) {
        throw new Error("No order data received from server");
      }

      set({ orders: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ loading: false });
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load orders"
      );
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/payments/${orderId}`, {
        status: newStatus,
      });

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.updatedOrder.status }
            : order
        ),
      }));

      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  },
}));
