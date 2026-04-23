import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../services/ProductService';

/**
 * INTERFAZ: CartItem
 * -----------------
 * Extendemos el producto para añadir la propiedad de cantidad.
 */
export interface CartItem extends Product {
    quantity: number;
}

/**
 * INTERFAZ: CartContextType
 * -------------------------
 * Define la estructura de nuestro estado global del carrito.
 */
interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Añadir producto al carrito
    const addToCart = (product: Product) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Si ya existe, incrementamos la cantidad
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Si es nuevo, lo añadimos con cantidad 1
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
        // Usamos el precio final considerando el descuento si existe
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
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
