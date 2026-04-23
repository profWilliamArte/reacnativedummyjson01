import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import ProductItem from '../components/ProductItem';
import ProductService, { Product, Category } from '../services/ProductService';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import QuickAddModal from '../components/QuickAddModal';

export default function HomeScreen({ navigation }: any) {
    // Estados principales
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Estados para el Modal de Añadido Rápido
    const [quickAddVisible, setQuickAddVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Contextos
    const { totalItems, addToCart } = useCart();
    const { showToast } = useToast();

    // Configuración del Header dinámico
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity 
                    style={styles.cartButton} 
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text style={styles.cartIcon}>🛒</Text>
                    {totalItems > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalItems}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, totalItems]);

    // Carga de datos iniciales
    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [productsData, categoriesData] = await Promise.all([
                ProductService.getProducts(),
                ProductService.getCategories()
            ]);
            setAllProducts(productsData);
            setFilteredProducts(productsData);
            setCategories(categoriesData);
        } catch (err: any) {
            setError(err.message || "Error al conectar con el servidor.");
            Alert.alert("Error", `Detalle: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    // Lógica de búsqueda
    const handleSearch = async (text: string) => {
        setSearch(text);
        setSelectedCategory(null);
        if (text.length > 2) {
            setLoading(true);
            const results = await ProductService.searchProducts(text);
            setFilteredProducts(results);
            setLoading(false);
        } else if (text.length === 0) {
            setFilteredProducts(allProducts);
        }
    };

    // Lógica de filtro por categoría
    const handleCategorySelect = async (category: string | null) => {
        if (selectedCategory === category) return;
        setSelectedCategory(category);
        setSearch('');
        setLoading(true);
        if (category === null) {
            setFilteredProducts(allProducts);
        } else {
            const results = await ProductService.getProductsByCategory(category);
            setFilteredProducts(results);
        }
        setLoading(false);
    };

    // Manejo de eventos de navegación y modal
    const handleProductPress = (product: Product) => {
        navigation.navigate('Details', { productId: product.id });
    };

    const handleQuickAddPress = (product: Product) => {
        setSelectedProduct(product);
        setQuickAddVisible(true);
    };

    const handleConfirmQuickAdd = (product: Product) => {
        addToCart(product);
        setQuickAddVisible(false);
        showToast(`¡${product.title} añadido!`, 'success');
    };

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
            {error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorTitle}>¡Ups! Algo falló</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadInitialData}>
                        <Text style={styles.retryText}>REINTENTAR</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.headerControls}>
                        {/* Buscador */}
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar productos..."
                                placeholderTextColor={theme.colors.textMuted}
                                value={search}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {/* Filtro de Categorías */}
                        <View style={styles.filterWrapper}>
                            <FlatList
                                horizontal
                                data={[null, ...categories]}
                                keyExtractor={(item) => typeof item === 'string' ? item : (item?.slug || 'all')}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterList}
                                renderItem={({ item }) => {
                                    const isSelected = (item === null && selectedCategory === null) || 
                                                     (item !== null && selectedCategory === item.slug);
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleCategorySelect(item ? item.slug : null)}
                                            style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                                        >
                                            <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                                                {item === null ? '🏷️ TODOS' : item.name.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>

                        <Text style={styles.countText}>
                            {loading ? 'Cargando...' : `${filteredProducts.length} productos encontrados`}
                        </Text>
                    </View>

                    {loading && filteredProducts.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={styles.loadingText}>Sincronizando catálogo...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <ProductItem
                                    product={item}
                                    onPress={handleProductPress}
                                    onQuickAdd={handleQuickAddPress}
                                />
                            )}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </>
            )}

            {/* Modal de Añadido Rápido */}
            <QuickAddModal
                visible={quickAddVisible}
                product={selectedProduct}
                onClose={() => setQuickAddVisible(false)}
                onConfirm={handleConfirmQuickAdd}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerControls: {
        backgroundColor: theme.colors.background,
        paddingBottom: 10,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
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
    filterWrapper: {
        marginTop: 5,
    },
    filterList: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 10,
    },
    categoryChip: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    categoryChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryChipText: {
        color: theme.colors.textSecondary,
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    countText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 20,
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
        backgroundColor: theme.colors.background,
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
    },
    cartButton: {
        marginRight: 10,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartIcon: {
        fontSize: 22,
    },
    badge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: theme.colors.danger,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: theme.colors.background,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
