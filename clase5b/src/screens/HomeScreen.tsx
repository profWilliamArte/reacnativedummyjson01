import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { theme } from '../../src/constants/theme';
import ProductItem from '../../src/components/ProductItem';
import ProductService, { Product, Category } from '../../src/services/ProductService';

export default function HomeScreen({ navigation }: any) {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Cargar productos y categorías en paralelo
            const [productsData, categoriesData] = await Promise.all([
                ProductService.getProducts(),
                ProductService.getCategories()
            ]);

            setAllProducts(productsData);
            setFilteredProducts(productsData);
            setCategories(categoriesData);
            setLoading(false);
        } catch (err: any) {
            setError(err.message || "Error al conectar con el servidor.");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInitialData();
    }, []);

    const handleSearch = async (text: string) => {
        setSearch(text);
        setSelectedCategory(null); // Resetear categoría al buscar
        
        if (text.length > 2) {
            setLoading(true);
            const results = await ProductService.searchProducts(text);
            setFilteredProducts(results);
            setLoading(false);
        } else if (text.length === 0) {
            setFilteredProducts(allProducts);
        }
    };

    const handleCategorySelect = async (category: string | null) => {
        if (selectedCategory === category) return;
        
        setSelectedCategory(category);
        setSearch(''); // Limpiar búsqueda al filtrar por categoría
        setLoading(true);

        if (category === null) {
            setFilteredProducts(allProducts);
        } else {
            const results = await ProductService.getProductsByCategory(category);
            setFilteredProducts(results);
        }
        setLoading(false);
    };

    const handleProductPress = (product: Product) => {
        navigation.navigate('Details', { productId: product.id });
    };

    return (
        <View style={styles.container}>
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
                                data={[null, ...categories]} // null representa "TODOS"
                                keyExtractor={(item) => typeof item === 'string' ? item : (item?.slug || 'all')}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterList}
                                renderItem={({ item }) => {
                                    const isSelected = (item === null && selectedCategory === null) || 
                                                     (item !== null && selectedCategory === item.slug);
                                    
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleCategorySelect(item ? item.slug : null)}
                                            style={[
                                                styles.categoryChip,
                                                isSelected && styles.categoryChipActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.categoryChipText,
                                                isSelected && styles.categoryChipTextActive
                                            ]}>
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
                                />
                            )}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </>
            )}
        </View>
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
    }
});
