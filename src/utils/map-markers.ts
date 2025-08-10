import L from "leaflet";

// Función para generar un color determinístico basado en el ID de MongoDB
const generateColorFromMongoId = (mongoId: string): string => {
  // Usar los últimos 6 caracteres del ID de MongoDB, que cambian más frecuentemente
  const lastChars = mongoId.slice(-6);

  // Convertir a número usando los caracteres hexadecimales
  let hash = 0;
  for (let i = 0; i < lastChars.length; i++) {
    const char = lastChars.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir a 32bit integer
  }

  // Generar colores más distintos usando una paleta predefinida
  const colors = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#e67e22",
    "#1abc9c",
    "#34495e",
    "#f1c40f",
    "#8e44ad",
    "#27ae60",
    "#2980b9",
    "#c0392b",
    "#d35400",
    "#16a085",
    "#7f8c8d",
    "#f39c12",
    "#e74c3c",
    "#9b59b6",
    "#3498db",
  ];

  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

// Cache para colores generados (optimización)
const colorCache: { [key: string]: string } = {};

const getColorForCategory = (
  categoryId?: string,
  categoryName?: string
): string => {
  const key = categoryId || categoryName || "default";

  if (!colorCache[key]) {
    if (key === "default") {
      colorCache[key] = "#2c3e50";
    } else {
      // Priorizar el ID de MongoDB para mejor distribución de colores
      if (categoryId && categoryId.length >= 12) {
        colorCache[key] = generateColorFromMongoId(categoryId);
      } else {
        // Fallback para nombres de categoría
        colorCache[key] = generateColorFromMongoId(categoryName || "default");
      }
    }
  }

  return colorCache[key];
};

// Rating-based opacity mapping (menos transparencia)
const getRatingOpacity = (rating?: number): number => {
  if (!rating) return 0.85;
  if (rating >= 4) return 1.0;
  if (rating >= 3) return 0.95;
  if (rating >= 2) return 0.9;
  return 0.8;
};

export const createCustomMarkerIcon = (
  categoryId?: string,
  categoryName?: string,
  rating?: number
): L.Icon => {
  const color = getColorForCategory(categoryId, categoryName);
  const opacity = getRatingOpacity(rating);

  // Crear un marcador tipo pin personalizado con SVG
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.3 12.5 28.5 12.5 28.5s12.5-20.2 12.5-28.5C25 5.6 19.4 0 12.5 0z" 
            fill="${color}" 
            stroke="#fff" 
            stroke-width="2" 
            opacity="${opacity}"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
    </svg>
  `;

  // Crear sombra local con SVG
  const shadowSvg = `
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="37" rx="13" ry="4" fill="rgba(0,0,0,0.3)"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: `data:image/svg+xml;base64,${btoa(shadowSvg)}`,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
};

export const getCategoryColor = (
  categoryId?: string,
  categoryName?: string
): string => {
  return getColorForCategory(categoryId, categoryName);
};
