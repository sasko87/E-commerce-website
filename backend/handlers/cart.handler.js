import { filterProducts } from "../pkg/product.model.js";

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    return res.status(200).send(user.cartItems);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    return res.status(200).send(user.cartItems);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === id);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== id);
        await user.save();
        return res.status(200).send(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      return res.status(200).send(user.cartItems);
    } else {
      return res.status(404).send({ error: "Product not found" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};
const getCartProducts = async (req, res) => {
  try {
    const products = await filterProducts({ _id: req.user.cartItems });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return {
        ...product.toJSON(),
        quantity: item.quantity,
      };
    });

    return res.status(200).send(cartItems);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export { addToCart, removeAllFromCart, updateQuantity, getCartProducts };
