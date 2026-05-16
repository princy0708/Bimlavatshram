import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabaseClient';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      // Get all wishlist items for this user and join with products table
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }

    const existingItem = wishlist.find(item => item.product_id === product.id);

    try {
      if (existingItem) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('id', existingItem.id);

        if (error) throw error;
        setWishlist(wishlist.filter(item => item.id !== existingItem.id));
      } else {
        // Add to wishlist
        const { data, error } = await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, product_id: product.id }])
          .select()
          .single();

        if (error) throw error;
        setWishlist([...wishlist, { id: data.id, product_id: product.id, products: product }]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error.message);
      alert('Error updating wishlist: ' + error.message);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
