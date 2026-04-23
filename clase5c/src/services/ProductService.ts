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
            const data = await response.json();

            // Cachear productos para acceso rápido posterior
            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error en ProductService (getProducts):", error);
            return [];
        }
    }

    // ✅ Este método permite obtener información completa/fresca de un producto
    async getProductDetails(id: number): Promise<Product | null> {
        // 1. Si ya lo tenemos en caché, lo devolvemos inmediatamente
        if (this.productCache.has(id)) {
            return this.productCache.get(id) || null;
        }

        // 2. Si no, hacemos el fetch individual
        try {
            const response = await fetch(`${BASE_URL}/${id}`);
            const product = await response.json();
            this.productCache.set(id, product);
            return product;
        } catch (error) {
            console.error("Error buscando detalles del producto:", error);
            return null;
        }
    }

    // Buscar productos por texto
    async searchProducts(query: string): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}/search?q=${query}`);
            const data = await response.json();

            // También cacheamos los resultados de búsqueda
            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error en ProductService (searchProducts):", error);
            return [];
        }
    }

    // Obtener listado de categorías disponibes
    async getCategories(): Promise<Category[]> {
        try {
            const response = await fetch(`${BASE_URL}/categories`);
            const data = await response.json();
            // Mapeamos para asegurar que tenemos slug y name
            return data.map((cat: any) => ({
                slug: cat.slug,
                name: cat.name
            }));
        } catch (error) {
            console.error("Error en ProductService (getCategories):", error);
            return [];
        }
    }

    // Obtener productos filtrados por categoría
    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const response = await fetch(`${BASE_URL}/category/${category}`);
            const data = await response.json();
            
            // También cacheamos estos productos
            data.products.forEach((p: Product) => {
                this.productCache.set(p.id, p);
            });

            return data.products;
        } catch (error) {
            console.error("Error buscando por categoría:", error);
            return [];
        }
    }

}

export default new ProductService();
