import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../services/ProductService';

const CART_STORAGE_KEY = '@ecommerce_cart_clase5d';

/**
 * INTERFAZ: CartItem
 */
export interface CartItem extends Product {
    quantity: number;
}

/**
 * INTERFAZ: CartContextType
 */
interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. CARGAR DATOS AL INICIAR
    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (storedCart) {
                    setItems(JSON.parse(storedCart));
                }
            } catch (error: any) {
                console.error('Error cargando el carrito:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    // 2. GUARDAR DATOS AUTOMÁTICAMENTE CUANDO EL ESTADO CAMBIE
    useEffect(() => {
        const saveCart = async () => {
            if (loading) return; // No guardar mientras cargamos inicial

            try {
                await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (error: any) {
                console.error('Error guardando el carrito:', error);
            }
        };
        saveCart();
    }, [items, loading]);

    // Añadir producto al carrito
    const addToCart = (product: Product) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Eliminar producto del carrito
    const removeFromCart = (productId: number) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Actualizar cantidad de un producto
    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Vaciar carrito
    const clearCart = () => setItems([]);

    // Cálculos derivados
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const discount = Math.abs(item.discountPercentage);
        const finalPrice = discount > 0
            ? item.price * (1 - discount / 100)
            : item.price;
        return sum + (finalPrice * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
