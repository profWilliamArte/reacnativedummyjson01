import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView, Pressable } from 'react-native';
import { theme } from '../constants/theme';
import { CartItem } from '../contexts/CartContext';

interface Props {
    visible: boolean;
    items: CartItem[];
    total: number;
    onClose: () => void;
}

export default function OrderSummaryModal({ visible, items, total, onClose }: Props) {
    const orderNumber = Math.floor(Math.random() * 90000) + 10000;
    const date = new Date().toLocaleDateString();

    const formatPrice = (value: number) => {
        const parts = value.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return parts.join(',');
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.ticket}>
                    <View style={styles.header}>
                        <Text style={styles.successIcon}>✅</Text>
                        <Text style={styles.title}>¡Pedido Recibido!</Text>
                        <Text style={styles.orderId}>#ORD-{orderNumber}</Text>
                        <Text style={styles.date}>{date}</Text>
                    </View>

                    <View style={styles.divider} />

                    <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
                        {items.map((item) => {
                            const discount = Math.abs(item.discountPercentage);
                            const finalPrice = discount > 0 
                                ? item.price * (1 - discount / 100) 
                                : item.price;
                                
                            return (
                                <View key={item.id} style={styles.itemRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName}>{item.title}</Text>
                                        <Text style={styles.itemDetail}>
                                            {item.quantity} x ${formatPrice(finalPrice)}
                                        </Text>
                                    </View>
                                    <Text style={styles.itemTotal}>
                                        ${formatPrice(finalPrice * item.quantity)}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.divider} />

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL PAGADO</Text>
                            <Text style={styles.totalValue}>${formatPrice(total)}</Text>
                        </View>
                        
                        <Text style={styles.thankYou}>Gracias por elegir Shopping Center</Text>

                        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                            <Text style={styles.doneButtonText}>ENTENDIDO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    ticket: {
        backgroundColor: '#FFF',
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    successIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    title: {
        color: '#0F172A',
        fontSize: 22,
        fontWeight: '900',
    },
    orderId: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    date: {
        color: '#94A3B8',
        fontSize: 12,
    },
    divider: {
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginVertical: 15,
    },
    itemList: {
        maxHeight: 250,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemName: {
        color: '#1E293B',
        fontSize: 14,
        fontWeight: '600',
    },
    itemDetail: {
        color: '#64748B',
        fontSize: 12,
    },
    itemTotal: {
        color: '#1E293B',
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '900',
    },
    totalValue: {
        color: theme.colors.primary,
        fontSize: 22,
        fontWeight: '900',
    },
    thankYou: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 13,
        fontStyle: 'italic',
        marginBottom: 25,
    },
    doneButton: {
        backgroundColor: '#0F172A',
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
