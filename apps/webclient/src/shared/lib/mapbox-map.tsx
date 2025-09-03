"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// GeoJSON Feature type for better type safety
interface GeoJSONFeature {
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
    properties: Record<string, unknown>;
}

// GeoJSON FeatureCollection type
interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

// Set Mapbox access token for Vite environment
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

interface PlotPoint {
    id: string;
    city: string;
    latitude: number;
    longitude: number;
    title: string;
    address: string;
    area: number;
    price: number;
    type: "industrial" | "residential" | "commercial" | "logistics";
    status: "available" | "sold" | "reserved";
    images: string[];
    description: string;
    amenities: string[];
    electricity?: string;
    gas?: string;
    water?: string;
}

interface CityData {
    [cityName: string]: PlotPoint[];
}

interface MapboxMapProps {
    data: CityData;
    language: "en" | "ar";
}

export function MapboxMap({ data, language }: MapboxMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const currentPopup = useRef<mapboxgl.Popup | null>(null);
    const [lng] = useState(44.5); // Center of Saudi Arabia
    const [lat] = useState(24.5);
    const [zoom] = useState(5); // Zoomed out to show all points
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);

    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl">
                <div className="text-center p-6">
                    <p className="text-gray-600 mb-2">Mapbox configuration required</p>
                    <p className="text-sm text-gray-500">Please set VITE_MAPBOX_ACCESS_TOKEN</p>
                </div>
            </div>
        );
    }

    // Convert data to GeoJSON format for city clusters
    const convertToCityClusters = (cityData: CityData): GeoJSONFeatureCollection => {
        const features: GeoJSONFeature[] = [];

        Object.entries(cityData).forEach(([cityName, plots]) => {
            // Calculate city center from all plots
            const totalLat = plots.reduce((sum, plot) => sum + plot.latitude, 0);
            const totalLng = plots.reduce((sum, plot) => sum + plot.longitude, 0);
            const centerLat = totalLat / plots.length;
            const centerLng = totalLng / plots.length;

            // Add city cluster point
            features.push({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [centerLng, centerLat]
                },
                properties: {
                    id: `city-${cityName}`,
                    name: cityName,
                    type: "city-cluster",
                    count: plots.length,
                    plots: plots
                }
            });
        });

        return {
            type: "FeatureCollection",
            features: features
        };
    };

    // Convert data to GeoJSON format for individual plots
    const convertToPlotPoints = (cityData: CityData, cityName?: string): GeoJSONFeatureCollection => {
        const features: GeoJSONFeature[] = [];

        if (cityName && cityData[cityName]) {
            // Show only plots for the selected city
            cityData[cityName].forEach(plot => {
                features.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [plot.longitude, plot.latitude]
                    },
                    properties: {
                        id: plot.id,
                        name: plot.title,
                        type: "plot",
                        plotType: plot.type,
                        plotData: plot,
                        city: plot.city,
                        address: plot.address,
                        area: plot.area,
                        electricity: plot.electricity,
                        gas: plot.gas,
                        water: plot.water
                    }
                });
            });
        }

        return {
            type: "FeatureCollection",
            features: features
        };
    };

    useEffect(() => {
        if (map.current) return; // Initialize map only once

        if (mapContainer.current) {
            try {
                console.log("Initializing Mapbox with token:", mapboxgl.accessToken ? "Token present" : "No token");
                
                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/mapbox/light-v11", // Clean light theme
                    center: [lng, lat],
                    zoom: zoom,
                    attributionControl: false,
                    scrollZoom: false,
                    language: language // Use the language prop
                });
                
                console.log("Map created successfully");
            } catch (error) {
                console.error("Error creating Mapbox map:", error);
                setMapError(error instanceof Error ? error.message : "Failed to initialize map");
                return;
            }

            // Add navigation controls
            map.current.addControl(new mapboxgl.NavigationControl(), "top-left");

            // Add fullscreen control
            map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

            // Enable scroll zoom only when Ctrl key is pressed
            map.current.on('wheel', (e) => {
                if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
                    e.originalEvent.preventDefault();
                    const delta = e.originalEvent.deltaY;
                    const zoom = map.current!.getZoom();
                    map.current!.setZoom(zoom - delta * 0.01);
                }
            });

            // Wait for map to load before adding sources and layers
            map.current.on("load", () => {
                if (!map.current) return;

                // Convert data to GeoJSON for city clusters
                const cityClustersData = convertToCityClusters(data);



                // Calculate bounds to fit all city clusters
                if (cityClustersData.features.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds();
                    cityClustersData.features.forEach((feature) => {
                        bounds.extend(feature.geometry.coordinates);
                    });

                    // Fit map to bounds with padding
                    map.current.fitBounds(bounds, {
                        padding: 50,
                        maxZoom: 8
                    });

                    // Set strict bounds to prevent moving outside the initial area
                    map.current.setMaxBounds(bounds);
                }

                // Generate dynamic city cluster markers with counts
                const cityClusterMarkers = Object.entries(data).map(([cityName, plots]) => {
                    const count = plots.length;
                    return {
                        name: `city-cluster-${cityName}`,
                        url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#695DC2"/>
                                <text x="20" y="24" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${count}</text>
                            </svg>
                        `)
                    };
                });

                // Add plot marker image - single design for all types
                const plotMarkers = [
                    {
                        name: "plot", url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.1">
                                <rect width="40" height="40" rx="20" fill="#695DC2"/>
                            </g>
                            <g opacity="0.2">
                                <rect x="8" y="8" width="24" height="24" rx="12" fill="#695DC2"/>
                            </g>
                            <rect x="15" y="15" width="10" height="10" rx="5" fill="#695DC2"/>
                        </svg>
                    `)
                    }
                ];

                const allMarkers = [...cityClusterMarkers, ...plotMarkers];

                // Wait for images to load before adding layers
                Promise.all(allMarkers.map(({ name, url }) => {
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            if (map.current) {
                                map.current.addImage(name, img);
                            }
                            resolve();
                        };
                        img.src = url;
                    });
                })).then(() => {
                    // Add layers after images are loaded
                    if (!map.current) return;

                    // Add city cluster layer
                    map.current.addLayer({
                        id: "city-clusters",
                        type: "symbol",
                        source: "city-clusters",
                        filter: ["!=", ["get", "name"], selectedCity || ""],
                        layout: {
                            "icon-image": ["concat", "city-cluster-", ["get", "name"]],
                            "icon-size": 1,
                            "icon-allow-overlap": true
                        }
                    });

                    // Add plot points layer
                    map.current.addLayer({
                        id: "plot-points",
                        type: "symbol",
                        source: "plot-points",
                        layout: {
                            "icon-image": "plot",
                            "icon-size": 1,
                            "icon-allow-overlap": true
                        }
                    });

                    // Add event handlers
                    // City cluster click handler
                    map.current.on("click", "city-clusters", (e) => {
                        if (!e.features?.[0]) return;

                        const properties = e.features[0].properties;
                        if (!properties || properties.type !== "city-cluster") return;

                        const cityName = properties.name;
                        setSelectedCity(cityName);

                        // Hide all city clusters when a city is selected
                        if (map.current) {
                            map.current.setFilter("city-clusters", ["==", ["get", "name"], ""]);
                        }

                        // Show individual plots
                        const plotPointsData = convertToPlotPoints(data, cityName);
                        const source = map.current?.getSource("plot-points") as mapboxgl.GeoJSONSource;
                        if (source) {
                            source.setData(plotPointsData);
                        }

                        // Zoom to city with bounds calculation to show all plots
                        const cityPlots = data[cityName];
                        if (cityPlots && cityPlots.length > 0) {
                            const bounds = new mapboxgl.LngLatBounds();
                            cityPlots.forEach(plot => {
                                bounds.extend([plot.longitude, plot.latitude]);
                            });

                            map.current?.fitBounds(bounds, {
                                padding: 50,
                                maxZoom: 14,
                                duration: 1000
                            });
                        } else {
                            // Fallback to center zoom if no plots found
                            const geometry = e.features[0].geometry;
                            const coordinates = (geometry as unknown as { coordinates: [number, number] }).coordinates;
                            map.current?.easeTo({
                                center: coordinates,
                                zoom: 12,
                                duration: 1000
                            });
                        }
                    });

                    // Plot point click handler
                    map.current.on("click", "plot-points", (e) => {
                        if (!e.features?.[0]) return;

                        const geometry = e.features[0].geometry;
                        const coordinates = (geometry as unknown as { coordinates: [number, number] }).coordinates.slice() as [number, number];
                        const properties = e.features[0].properties;

                        if (!properties || properties.type !== "plot") return;

                        const plot = properties.plotData;

                        // Create popup content with fallback values - try multiple ways to access the data
                        const popupContent = `
                            <div class="p-4 bg-white rounded-lg max-w-xs relative">
                                <button class="absolute top-2 ${language === "ar" ? "left-2" : "right-2"} w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center text-lg font-bold hover:bg-gray-700 transition-colors cursor-pointer shadow-sm" onclick="this.closest('.mapboxgl-popup').remove()">
                                    ×
                                </button>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2 ${language === "ar" ? "pl-8" : "pr-8"}">${properties.title || properties.name || plot?.title || plot?.name || (language === "ar" ? "قطعة أرض غير مسمى" : "Untitled Plot")}</h3>
                                <p class="text-sm text-gray-600 mb-2">${properties.address || properties.city || plot?.address || plot?.city || (language === "ar" ? "الموقع غير محدد" : "Location not specified")}</p>
                                <div class="space-y-1 text-sm text-gray-600">
                                    <div><span class="font-medium">${language === "ar" ? "المساحة" : "Area"}:</span> ${properties.area || plot?.area || 0} m²</div>
                                    <div><span class="font-medium">${language === "ar" ? "الكهرباء" : "Electricity"}:</span> ${properties.electricity || plot?.electricity || "N/A"}</div>
                                    <div><span class="font-medium">${language === "ar" ? "الغاز" : "Gas"}:</span> ${properties.gas || plot?.gas || "N/A"}</div>
                                    <div><span class="font-medium">${language === "ar" ? "الماء" : "Water"}:</span> ${properties.water || plot?.water || "N/A"}</div>
                                </div>
                                <div class="mt-3 flex gap-2">
                                    <button class="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">
                                        ${language === "ar" ? "عرض" : "View"}
                                    </button>
                                    <button class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                                        ${language === "ar" ? "قارن" : "Compare"}
                                    </button>
                                </div>
                            </div>
                        `;

                        // Close any existing popup
                        if (currentPopup.current) {
                            currentPopup.current.remove();
                        }

                        // Create and show popup
                        const popup = new mapboxgl.Popup({
                            closeButton: false,
                            closeOnClick: true
                        })
                            .setLngLat(coordinates)
                            .setHTML(popupContent)
                            .addTo(map.current!);

                        // Store reference to current popup
                        currentPopup.current = popup;
                    });

                    // Add hover effects
                    map.current.on("mouseenter", "city-clusters", () => {
                        if (map.current) {
                            map.current.getCanvas().style.cursor = "pointer";
                        }
                    });

                    map.current.on("mouseleave", "city-clusters", () => {
                        if (map.current) {
                            map.current.getCanvas().style.cursor = "";
                        }
                    });

                    map.current.on("mouseenter", "plot-points", () => {
                        if (map.current) {
                            map.current.getCanvas().style.cursor = "pointer";
                        }
                    });

                    map.current.on("mouseleave", "plot-points", () => {
                        if (map.current) {
                            map.current.getCanvas().style.cursor = "";
                        }
                    });
                });

                // Add GeoJSON source for city clusters
                map.current.addSource("city-clusters", {
                    type: "geojson",
                    data: cityClustersData
                });

                // Add GeoJSON source for plot points (initially empty)
                map.current.addSource("plot-points", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: []
                    }
                });
            });
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [lng, lat, zoom, data, language]);

    // Update map language when language prop changes
    useEffect(() => {
        if (map.current) {
            map.current.setLanguage(language);
        }
    }, [language]);

    const handleBackToCities = () => {
        // Close any open popup
        if (currentPopup.current) {
            currentPopup.current.remove();
            currentPopup.current = null;
        }

        setSelectedCity(null);
        if (map.current) {
            // Show all city clusters by removing the filter
            map.current.setFilter("city-clusters", null);

            // Clear plot points
            const source = map.current.getSource("plot-points") as mapboxgl.GeoJSONSource;
            if (source) {
                source.setData({
                    type: "FeatureCollection",
                    features: []
                });
            }

            // Fit bounds to show all cities
            const cityClustersData = convertToCityClusters(data);
            if (cityClustersData.features.length > 0) {
                const bounds = new mapboxgl.LngLatBounds();
                cityClustersData.features.forEach((feature) => {
                    bounds.extend(feature.geometry.coordinates);
                });

                map.current.fitBounds(bounds, {
                    padding: 50,
                    maxZoom: 8
                });
            }
        }
    };

    if (mapError) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl">
                <div className="text-center p-6">
                    <p className="text-red-600 mb-2">Map initialization failed</p>
                    <p className="text-sm text-gray-500">{mapError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="w-full h-full rounded-xl" />

            {/* Back button when a city is selected */}
            {selectedCity && (
                <div className="absolute top-2 left-12 z-10 border-2 border-gray-300 rounded-lg">
                    <button
                        onClick={handleBackToCities}
                        className="bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {language === "ar" ? "العودة إلى المدن" : "Back to Cities"}
                    </button>
                </div>
            )}
        </div>
    );
}