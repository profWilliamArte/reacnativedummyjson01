import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native';
import { theme } from '../constants/theme';
import { Product } from '../services/ProductService';

interface Props {
    visible: boolean;
    product: Product | null;
    onClose: () => void;
    onConfirm: (product: Product) => void;
}

export default function QuickAddModal({ visible, product, onClose, onConfirm }: Props) {
    if (!product) return null;

    const discount = Math.abs(product.discountPercentage);
    const finalPrice = discount > 0 
        ? product.price * (1 - discount / 100) 
        : product.price;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <View style={styles.indicator} />
                        </View>

                        <View style={styles.content}>
                            <Image 
                                source={{ uri: product.thumbnail }} 
                                style={styles.image}
                                resizeMode="contain"
                            />
                            
                            <View style={styles.details}>
                                <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
                                <Text style={styles.brand}>{product.brand}</Text>
                                
                                <View style={styles.priceContainer}>
                                    <Text style={styles.price}>${finalPrice.toFixed(2)}</Text>
                                    {discount > 0 && (
                                        <Text style={styles.discount}>-{discount.toFixed(0)}% OFF</Text>
                                    )}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => onConfirm(product)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addButtonText}>AÑADIR A MI COMPRA</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Quizás luego</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        width: '100%',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    indicator: {
        width: 40,
        height: 5,
        backgroundColor: theme.colors.surfaceLight,
        borderRadius: 3,
    },
    content: {
        flexDirection: 'row',
        marginBottom: 30,
        gap: 20,
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    brand: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    price: {
        color: theme.colors.primary,
        fontSize: 22,
        fontWeight: '900',
    },
    discount: {
        color: theme.colors.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    closeButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    closeButtonText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    }
});
