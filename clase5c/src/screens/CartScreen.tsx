import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity, 
    Image, 
    SafeAreaView 
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { theme } from '../constants/theme';

export default function CartScreen({ navigation }: any) {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🛒</Text>
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>IR A COMPRAR</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const discount = Math.abs(item.discountPercentage);
                    const finalPrice = discount > 0 
                        ? item.price * (1 - discount / 100) 
                        : item.price;

                    return (
                        <View style={styles.cartItem}>
                            <Image source={{ uri: item.thumbnail }} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.price}>${formatPrice(finalPrice)}</Text>
                                
                                <View style={styles.controls}>
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{item.quantity}</Text>
                                        <TouchableOpacity 
                                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <TouchableOpacity 
                                        onPress={() => removeFromCart(item.id)}
                                        style={styles.removeButton}
                                    >
                                        <Text style={styles.removeText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total a pagar:</Text>
                    <Text style={styles.totalAmount}>${formatPrice(totalPrice)}</Text>
                </View>
                
                <TouchableOpacity 
                    style={styles.checkoutButton}
                    onPress={() => {
                        alert("¡Gracias por tu compra!");
                        clearCart();
                        navigation.navigate('Home');
                    }}
                >
                    <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 15,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: theme.colors.background,
    },
    info: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '900',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        paddingHorizontal: 5,
    },
    qtyButton: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyButtonText: {
        color: theme.colors.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantity: {
        color: theme.colors.secondary,
        paddingHorizontal: 12,
        fontWeight: 'bold',
    },
    removeButton: {
        padding: 5,
    },
    removeText: {
        color: theme.colors.danger,
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        backgroundColor: theme.colors.surface,
        padding: 25,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        color: theme.colors.textMuted,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalAmount: {
        color: theme.colors.secondary,
        fontSize: 24,
        fontWeight: '900',
    },
    checkoutButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
    },
    checkoutText: {
        color: theme.colors.secondary,
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    backButton: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 15,
    },
    backButtonText: {
        color: theme.colors.primary,
        fontWeight: '900',
        letterSpacing: 1,
    }
});
