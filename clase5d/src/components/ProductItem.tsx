
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../services/ProductService';

interface Props {
    product: Product;
    onPress?: (product: Product) => void;
    onQuickAdd?: (product: Product) => void;
}

export default function ProductItem({ product, onPress, onQuickAdd }: Props) {
    // Formatear descuento para mostrar siempre positivo
    const discount = Math.abs(product.discountPercentage);
    const hasDiscount = discount > 0;
    const originalPrice = product.price;
    const finalPrice = hasDiscount
        ? originalPrice * (1 - discount / 100)
        : originalPrice;

    // Helper para formatear precio: 2499.99 -> 2.499,99
    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress?.(product)}
            activeOpacity={0.7}
        >
            {/* Imagen */}
            <Image
                source={{ uri: product.thumbnail }}
                style={styles.photo}
                resizeMode="cover"
            />

            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={2}>{product.title}</Text>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.category}>{product.category}</Text>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    {hasDiscount ? (
                        <>
                            <Text style={styles.originalPrice}>${formatPrice(originalPrice)}</Text>
                            <Text style={styles.finalPrice}>${formatPrice(finalPrice)}</Text>
                        </>
                    ) : (
                        <Text style={styles.price}>${formatPrice(product.price)}</Text>
                    )}
                </View>

                {/* Botón de Añadido Rápido */}
                <TouchableOpacity 
                    style={styles.quickAddButton}
                    onPress={() => onQuickAdd?.(product)}
                    activeOpacity={0.6}
                >
                    <Text style={styles.quickAddText}>+ AÑADIR</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        flexDirection: 'row',
        padding: 16,
        borderRadius: theme.roundness.lg || 16,
        marginBottom: 12,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: theme.colors.border || '#E5E7EB',
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    info: {
        marginLeft: 16,
        flex: 1,
    },
    header: {
        marginBottom: 8,
    },
    name: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    categoryBadge: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    category: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12,
    },
    originalPrice: {
        color: theme.colors.textMuted,
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    finalPrice: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    quickAddButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    quickAddText: {
        color: theme.colors.primary,
        fontSize: 11,
        fontWeight: '900',
    },
});
