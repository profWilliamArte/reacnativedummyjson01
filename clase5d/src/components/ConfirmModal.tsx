import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'primary';
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    type = 'primary'
}: Props) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        
                        <View style={styles.body}>
                            <Text style={styles.message}>{message}</Text>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={onCancel}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[
                                    styles.confirmButton, 
                                    { backgroundColor: type === 'danger' ? theme.colors.danger : theme.colors.primary }
                                ]} 
                                onPress={onConfirm}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.confirmText}>{confirmText}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        maxWidth: 400,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 25,
        padding: 24,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    body: {
        marginBottom: 24,
    },
    message: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
        alignItems: 'center',
    },
    cancelText: {
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    confirmButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 15,
        alignItems: 'center',
    },
    confirmText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});
