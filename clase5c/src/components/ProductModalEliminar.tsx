import React from 'react';
import { 
    Modal, 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Dimensions
} from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../services/ProductService';

const { height } = Dimensions.get('window');

interface Props {
    product: Product | null;
    visible: boolean;
    onClose: () => void;
}

export default function ProductModal({ product, visible, onClose }: Props) {
    if (!product) return null;

    // Lógica de Precios (Igual que en ProductItem)
    const discount = Math.abs(product.discountPercentage);
    const hasDiscount = discount > 0;
    const originalPrice = product.price;
    const finalPrice = hasDiscount
        ? originalPrice * (1 - discount / 100)
        : originalPrice;

    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Botón Cerrar Flotante */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Image
                            source={{ uri: product.thumbnail }}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        <View style={styles.body}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
                            </View>

                            <Text style={styles.title}>{product.title}</Text>
                            <Text style={styles.brand}>{product.brand}</Text>

                             <View style={styles.priceRow}>
                                <View>
                                    {hasDiscount && (
                                        <Text style={styles.originalPrice}>${formatPrice(originalPrice)}</Text>
                                    )}
                                    <Text style={styles.price}>${formatPrice(finalPrice)}</Text>
                                </View>
                                <View style={styles.badgesColumn}>
                                    <View style={styles.ratingBox}>
                                        <Text style={styles.ratingText}>★ {product.rating}</Text>
                                    </View>
                                    {hasDiscount && (
                                        <View style={[styles.discountBadge, { marginTop: 8 }]}>
                                            <Text style={styles.discountText}>-{discount.toFixed(0)}% OFF</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={styles.sectionTitle}>Descripción</Text>
                            <Text style={styles.description}>{product.description}</Text>

                            <View style={styles.stockInfo}>
                                <Text style={styles.stockLabel}>Stock Disponible:</Text>
                                <Text style={styles.stockValue}>{product.stock} unidades</Text>
                            </View>

                            <TouchableOpacity style={styles.buyButton} onPress={onClose}>
                                <Text style={styles.buyButtonText}>AÑADIR AL CARRITO</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // Fondo oscuro del tema con transparencia
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.roundness.lg,
        borderTopRightRadius: theme.roundness.lg,
        height: height * 0.85,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
        paddingTop: 40,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
        backgroundColor: theme.colors.surfaceLight,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: theme.colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: theme.colors.background,
    },
    body: {
        padding: 25,
    },
    categoryBadge: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    categoryText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    brand: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    price: {
        color: theme.colors.primary,
        fontSize: 32,
        fontWeight: '900',
    },
    originalPrice: {
        color: theme.colors.textMuted,
        fontSize: 16,
        textDecorationLine: 'line-through',
        marginBottom: -4,
    },
    badgesColumn: {
        alignItems: 'flex-end',
    },
    discountBadge: {
        backgroundColor: theme.colors.success,
        paddingHorizontal: 12,
        paddingVertical: 4,
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
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.surfaceLight,
        marginVertical: 20,
    },
    sectionTitle: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: theme.colors.textSecondary,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 25,
    },
    stockInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    stockLabel: {
        color: theme.colors.textMuted,
        fontSize: 14,
    },
    stockValue: {
        color: theme.colors.success,
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    buyButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: theme.roundness.md,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buyButtonText: {
        color: theme.colors.secondary,
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
});
