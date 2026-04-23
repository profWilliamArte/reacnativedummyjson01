import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'danger' | 'info'>('success');
    const [visible, setVisible] = useState(false);
    const translateY = React.useRef(new Animated.Value(-100)).current;

    const showToast = useCallback((msg: string, t: 'success' | 'danger' | 'info' = 'success') => {
        setMessage(msg);
        setType(t);
        setVisible(true);

        // Animación de entrada
        Animated.spring(translateY, {
            toValue: 50, // Ajustado para quedar debajo del header si es necesario
            useNativeDriver: true,
            bounciness: 10
        }).start();

        // Ocultar automáticamente después de 3 segundos
        setTimeout(() => {
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true
            }).start(() => setVisible(false));
        }, 3000);
    }, [translateY]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <Animated.View style={[
                    styles.toast,
                    { transform: [{ translateY }] },
                    type === 'danger' && styles.danger,
                    type === 'info' && styles.info
                ]}>
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de un ToastProvider');
    return context;
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        backgroundColor: theme.colors.success,
        padding: 16,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 9999,
    },
    danger: {
        backgroundColor: theme.colors.danger,
    },
    info: {
        backgroundColor: theme.colors.primary,
    },
    text: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    }
});
