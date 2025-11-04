import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../components/lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  loading: false,

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
      console.log(error);
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

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios("/products/featured");
      set({ featuredProducts: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
      console.log("featured posts", error);
    }
  },
}));
