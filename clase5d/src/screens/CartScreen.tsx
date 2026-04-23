import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity, 
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../contexts/CartContext';
import { theme } from '../constants/theme';
import ConfirmModal from '../components/ConfirmModal';
import OrderSummaryModal from '../components/OrderSummaryModal';

export default function CartScreen({ navigation }: any) {
    const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    
    // Estados para los Modales
    const [modalVisible, setModalVisible] = useState(false);
    const [summaryVisible, setSummaryVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{id: number, title: string} | null>(null);

    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    const handleDeletePress = (id: number, title: string) => {
        setSelectedItem({ id, title });
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            removeFromCart(selectedItem.id);
            setModalVisible(false);
            setSelectedItem(null);
        }
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
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
                                        onPress={() => handleDeletePress(item.id, item.title)}
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
                    onPress={() => setSummaryVisible(true)}
                >
                    <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Confirmación */}
            <ConfirmModal
                visible={modalVisible}
                title="¿Eliminar producto?"
                message={`¿Estás seguro de que deseas quitar "${selectedItem?.title}" del carrito?`}
                onConfirm={confirmDelete}
                onCancel={() => setModalVisible(false)}
                confirmText="Eliminar"
                type="danger"
            />

            <OrderSummaryModal
                visible={summaryVisible}
                items={items}
                total={totalPrice}
                onClose={() => {
                    setSummaryVisible(false);
                    clearCart();
                    navigation.navigate('Home');
                }}
            />
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