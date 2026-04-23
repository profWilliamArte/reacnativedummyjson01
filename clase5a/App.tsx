import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { theme } from './src/constants/theme';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import ProductItem from './src/components/ProductItem';
import ProductModal from './src/components/ProductModal';
import ProductService, { Product } from './src/services/ProductService';

export default function App() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Estado para el Detalle
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ProductService.getProducts();
            if (data.length === 0) {
                throw new Error("No se encontraron productos en la tienda.");
            }
            setAllProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || "Error al conectar con el servidor de productos.");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = async (text: string) => {
        setSearch(text);
        if (text.length > 2) {
            setLoading(true);
            const results = await ProductService.searchProducts(text);
            setFilteredProducts(results);
            setLoading(false);
        } else if (text.length === 0) {
            setFilteredProducts(allProducts);
        }
    };

    const handleProductPress = async (product: Product) => {
        // Obtenemos los detalles actualizados (de caché o API)
        const detailedProduct = await ProductService.getProductDetails(product.id);
        if (detailedProduct) {
            setSelectedProduct(detailedProduct);
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Header />

                {error ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorTitle}>¡Ups! Algo falló</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                            <Text style={styles.retryText}>REINTENTAR</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar productos..."
                                placeholderTextColor={theme.colors.textMuted}
                                value={search}
                                onChangeText={handleSearch}
                            />
                            <Text style={styles.countText}>
                                {loading ? 'Buscando...' : `${filteredProducts.length} productos encontrados`}
                            </Text>
                        </View>

                        {loading && allProducts.length === 0 ? (
                            <View style={styles.centerContainer}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.loadingText}>Cargando catálogo...</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredProducts}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <ProductItem
                                        product={item}
                                        onPress={handleProductPress}
                                    />
                                )}
                                contentContainerStyle={styles.listContent}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </>
                )}

                <ProductModal
                    product={selectedProduct}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

                <Footer />
                <StatusBar style="light" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    input: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.secondary,
        padding: 15,
        borderRadius: theme.roundness.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    countText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 8,
        textAlign: 'right',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        color: theme.colors.textSecondary,
        marginTop: 15,
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorTitle: {
        color: theme.colors.danger,
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 10,
    },
    errorText: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
    },
    retryButton: {
        borderWidth: 2,
        borderColor: theme.colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: theme.roundness.md,
    },
    retryText: {
        color: theme.colors.primary,
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 2,
    }
});
