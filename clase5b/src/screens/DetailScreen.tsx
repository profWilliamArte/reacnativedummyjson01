import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { theme } from '../../src/constants/theme';
import ProductService, { Product } from '../../src/services/ProductService';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route, navigation }: any) {
    const { productId } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProductDetails = async () => {
        setLoading(true);
        const data = await ProductService.getProductDetails(productId);
        setProduct(data);
        setLoading(false);
    };

    useEffect(() => {
        loadProductDetails();
    }, [productId]);

    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No se pudo cargar el producto.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backLink}>Regresar al catálogo</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const discount = Math.abs(product.discountPercentage);
    const hasDiscount = discount > 0;
    const originalPrice = product.price;
    const finalPrice = hasDiscount ? originalPrice * (1 - discount / 100) : originalPrice;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Gallery / Image Hero */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.thumbnail }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.brand}>Marca: {product.brand}</Text>
                </View>

                <View style={styles.priceSection}>
                    <View>
                        {hasDiscount && (
                            <Text style={styles.originalPrice}>${formatPrice(originalPrice)}</Text>
                        )}
                        <Text style={styles.price}>${formatPrice(finalPrice)}</Text>
                    </View>
                    <View style={styles.badgesRow}>
                        {hasDiscount && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{discount.toFixed(0)}% OFF</Text>
                            </View>
                        )}
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingText}>★ {product.rating}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Descripción del Producto</Text>
                <Text style={styles.description}>{product.description}</Text>

                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Stock</Text>
                        <Text style={[styles.infoValue, { color: product.stock < 10 ? theme.colors.danger : theme.colors.success }]}>
                            {product.stock} unidades
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Envío</Text>
                        <Text style={styles.infoValue}>Gratis a todo el país</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                    <Text style={styles.buyButtonText}>AÑADIR AL CARRITO</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        color: theme.colors.textSecondary,
        marginTop: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: theme.colors.danger,
        fontSize: 16,
        marginBottom: 10,
    },
    backLink: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    imageContainer: {
        width: width,
        height: 350,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '90%',
    },
    content: {
        padding: 24,
        backgroundColor: theme.colors.background,
    },
    header: {
        marginBottom: 20,
    },
    categoryBadge: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '900',
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 34,
    },
    brand: {
        color: theme.colors.textMuted,
        fontSize: 16,
        marginTop: 4,
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    price: {
        color: theme.colors.primary,
        fontSize: 36,
        fontWeight: '900',
    },
    originalPrice: {
        color: theme.colors.textMuted,
        fontSize: 18,
        textDecorationLine: 'line-through',
        marginBottom: -4,
    },
    badgesRow: {
        alignItems: 'flex-end',
        gap: 8,
    },
    discountBadge: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    ratingBox: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    ratingText: {
        color: theme.colors.warning,
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.surfaceLight,
        marginVertical: 25,
    },
    sectionTitle: {
        color: theme.colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    infoItem: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    infoLabel: {
        color: theme.colors.textMuted,
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        color: theme.colors.secondary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    buyButtonText: {
        color: theme.colors.secondary,
        fontWeight: '900',
        fontSize: 18,
        letterSpacing: 2,
    },
});
