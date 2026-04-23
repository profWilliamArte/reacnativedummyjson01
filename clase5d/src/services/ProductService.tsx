/**
 * SERVICIO: ProductService
 * -----------------------
 * Esta clase centraliza todas las peticiones a la API de DummyJSON (dummyjson.com).
 * 
 * ARQUITECTURA: Service Layer
 * ¿Por qué usamos esta capa?
 * 1. Desacoplamiento: Los componentes no saben cómo se obtienen los datos.
 * 2. Mantenibilidad: Centralizamos las URLs y la lógica de fetch.
 */

const BASE_URL = 'https://dummyjson.com/products';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface Category {
    slug: string;
    name: string;
}

class ProductService {
    private productCache = new Map<number, Product>();

    // Obtener todos los productos iniciales
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}?limit=30`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error en ProductService (getProducts):", error);
            throw error;
        }
    }

    // ✅ Este método permite obtener información completa/fresca de un producto
    async getProductDetails(id: number): Promise<Product | null> {
        if (this.productCache.has(id)) {
            return this.productCache.get(id) || null;
        }

        try {
            const response = await fetch(`${BASE_URL}/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const product = await response.json();
            this.productCache.set(id, product);
            return product;
        } catch (error) {
            console.error("Error buscando detalles del producto:", error);
            throw error;
        }
    }

    // Buscar productos por texto
    async searchProducts(query: string): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}/search?q=${query}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error en ProductService (searchProducts):", error);
            throw error;
        }
    }

    // Obtener listado de categorías disponibes
    async getCategories(): Promise<Category[]> {
        try {
            const response = await fetch(`${BASE_URL}/categories`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            if (Array.isArray(data)) {
                return data.map((cat: any) => {
                    if (typeof cat === 'string') {
                        return { slug: cat, name: cat };
                    }
                    return {
                        slug: cat.slug || cat.toString(),
                        name: cat.name || cat.toString()
                    };
                });
            }
            return [];
        } catch (error) {
            console.error("Error en ProductService (getCategories):", error);
            throw error;
        }
    }

    // Obtener productos filtrados por categoría
    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}/category/${category}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error buscando por categoría:", error);
            throw error;
        }
    }

}

export default new ProductService();