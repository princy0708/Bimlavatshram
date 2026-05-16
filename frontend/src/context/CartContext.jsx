import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Use cartItemId if it exists (which includes size/color variations), otherwise fallback to product id
      const uniqueId = product.cartItemId || product.id;
      
      const existingItemIndex = prevCart.findIndex(item => (item.cartItemId || item.id) === uniqueId);
      
      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      return [...prevCart, { ...product, quantity: 1, uniqueCartId: uniqueId }];
    });
  };

  const removeFromCart = (uniqueCartId) => {
    setCart(prevCart => prevCart.filter(item => (item.cartItemId || item.id) !== uniqueCartId));
  };

  const updateQuantity = (uniqueCartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(uniqueCartId);
      return;
    }
    setCart(prevCart => prevCart.map(item =>
      (item.cartItemId || item.id) === uniqueCartId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
