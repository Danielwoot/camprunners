import type { StyleSpecification } from 'maplibre-gl';

/**
 * Camprunners Tactical Cyber Dark Vector Tile Style
 * Powered by OpenFreeMap vector planet tiles with customized tactical typography & colors.
 */
export async function getCamprunnersVectorStyle(): Promise<StyleSpecification | string> {
  const BASE_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

  try {
    const response = await fetch(BASE_STYLE_URL);
    if (!response.ok) {
      return BASE_STYLE_URL;
    }

    const style: StyleSpecification = await response.json();

    // Customize layers to match Camprunners Tactical UI
    if (Array.isArray(style.layers)) {
      style.layers = style.layers.map((layer: any) => {
        const layerId = layer.id || '';

        // 1. Background & Water Colors
        if (layer.type === 'background') {
          return {
            ...layer,
            paint: {
              ...layer.paint,
              'background-color': '#050708'
            }
          };
        }

        if (layer.type === 'fill' && (layerId.includes('water') || layerId.includes('ocean'))) {
          return {
            ...layer,
            paint: {
              ...layer.paint,
              'fill-color': '#081014'
            }
          };
        }

        // 2. Tactical Typography for Place Names (Cities, Towns, Villages)
        if (layer.type === 'symbol') {
          const newLayout = { ...(layer.layout || {}) };
          const newPaint = { ...(layer.paint || {}) };

          // Place names: Major Cities, Towns, Suburbs (e.g. Kettleman City, Los Angeles)
          if (layerId.includes('place_city') || layerId.includes('place_town') || layerId.includes('place_label')) {
            newLayout['text-transform'] = 'uppercase';
            newLayout['text-letter-spacing'] = 0.12;
            newPaint['text-color'] = layerId.includes('capital') || layerId.includes('major') ? '#00f0ff' : '#f1f5f9';
            newPaint['text-halo-color'] = '#050505';
            newPaint['text-halo-width'] = 2.2;
            newPaint['text-halo-blur'] = 1;
          }

          // Parks & Natural Reserves
          if (layerId.includes('park') || layerId.includes('reserve') || layerId.includes('forest')) {
            newLayout['text-transform'] = 'uppercase';
            newLayout['text-letter-spacing'] = 0.1;
            newPaint['text-color'] = '#a3e635';
            newPaint['text-halo-color'] = '#050505';
            newPaint['text-halo-width'] = 2;
          }

          // Mountain Peaks & Summits
          if (layerId.includes('peak') || layerId.includes('mountain') || layerId.includes('volcano')) {
            newLayout['text-transform'] = 'uppercase';
            newLayout['text-letter-spacing'] = 0.08;
            newPaint['text-color'] = '#38bdf8';
            newPaint['text-halo-color'] = '#050505';
            newPaint['text-halo-width'] = 2;
          }

          // Roads & Highways
          if (layerId.includes('road') || layerId.includes('highway') || layerId.includes('motorway')) {
            newLayout['text-letter-spacing'] = 0.05;
            newPaint['text-color'] = '#94a3b8';
            newPaint['text-halo-color'] = '#050505';
            newPaint['text-halo-width'] = 1.5;
          }

          // Waterways & Marine
          if (layerId.includes('waterway') || layerId.includes('water_name')) {
            newPaint['text-color'] = '#0284c7';
            newPaint['text-halo-color'] = '#050505';
            newPaint['text-halo-width'] = 1.5;
          }

          return {
            ...layer,
            layout: newLayout,
            paint: newPaint
          };
        }

        return layer;
      });
    }

    return style;
  } catch (err) {
    console.error('[MapLibre] Failed to customize vector style, using default:', err);
    return BASE_STYLE_URL;
  }
}
