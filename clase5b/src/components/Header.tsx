import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>SHOPPING <Text style={styles.highlight}>DUMMY JSON</Text></Text>
            <View style={styles.divider} />
            <Text style={styles.subtitle}>GALERÍA DE PRODUCTOS 2026</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
    },
    title: {
        color: theme.colors.secondary,
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -1,
    },
    highlight: {
        color: theme.colors.primary,
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.primary,
        marginVertical: 10,
        borderRadius: 2,
    },
    subtitle: {
        color: theme.colors.textMuted,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
});