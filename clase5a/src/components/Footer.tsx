import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

export default function Footer() {
    return (
        <View style={styles.footer}>
            <View style={styles.container}>
                <Text style={styles.version}>v.5.0.1</Text>
                <Text style={styles.label}>CLASE 05: API INTEGRATION</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 20,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceLight,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    version: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    label: {
        color: theme.colors.textMuted,
        fontSize: 10,
        fontWeight: 'bold',
    },
});