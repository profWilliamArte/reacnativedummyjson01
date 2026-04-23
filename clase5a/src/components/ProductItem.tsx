import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../services/ProductService';

interface Props {
    product: Product;
    onPress?: (product: Product) => void;
}

export default function ProductItem({ product, onPress }: Props) {
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
            {/* Imagen más grande */}
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
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{discount.toFixed(0)}%</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.price}>${formatPrice(product.price)}</Text>
                    )}
                </View>

                {/* Indicador de stock si está disponible */}
                {product.stock !== undefined && product.stock < 10 && (
                    <View style={styles.stockWarning}>
                        <Text style={styles.stockText}>⚠️ Solo {product.stock} unidades</Text>
                    </View>
                )}
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    photo: {
        width: 100,  // Aumentado de 70 a 100
        height: 100, // Aumentado de 70 a 100
        borderRadius: theme.roundness.md || 12,
        backgroundColor: '#F3F4F6',
    },
    info: {
        marginLeft: 16,
        flex: 1,
        gap: 8,
    },
    header: {
        flex: 1,
    },
    name: {
        color: theme.colors.text || '#1F2937',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 20,
    },
    categoryBadge: {
        backgroundColor: theme.colors.primaryLight || '#E0E7FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    category: {
        color: theme.colors.primary || '#4F46E5',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 8,
    },
    originalPrice: {
        color: '#9CA3AF',
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    finalPrice: {
        color: theme.colors.primary || '#4F46E5',
        fontSize: 18,
        fontWeight: '800',
    },
    price: {
        color: theme.colors.primary || '#4F46E5',
        fontSize: 18,
        fontWeight: '800',
    },
    discountBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    stockWarning: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
    },
    stockText: {
        color: '#D97706',
        fontSize: 10,
        fontWeight: '500',
    },
});