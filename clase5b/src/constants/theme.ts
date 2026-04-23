/**
 * THEME: E-Commerce Premium (Clase 05)
 * ----------------------------------
 * Siguiendo el esquema de la Clase 04 de MLB, pero adaptado
 * a una paleta de colores para una tienda de productos.
 */

export const theme = {
    colors: {
        background: '#0F172A',       // Azul Pizarra Muy Oscuro (Fondo)
        surface: '#1E293B',          // Azul Pizarra Oscuro (Tarjetas)
        surfaceLight: '#334155',     // Gris Azulado (Inputs/Bordes)
        primary: '#6366F1',          // Indigo Vibrante (Color de acento principal)
        secondary: '#FFFFFF',        // Blanco para textos de alto contraste
        accent: '#1E1E1E',           // Gris neutro
        text: '#F8FAFC',             // Blanco humo para texto general
        textSecondary: '#94A3B8',    // Azul grisáceo para descripciones
        textMuted: '#64748B',        // Gris para detalles pequeños
        success: '#10B981',          // Esmeralda
        danger: '#EF4444',           // Rojo
        warning: '#F59E0B',          // Ámbar
        border: 'rgba(99, 102, 241, 0.1)', // Borde sutil con el color primario
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    roundness: {
        xs: 4,
        sm: 8,
        md: 15,
        lg: 30,
    }
};
