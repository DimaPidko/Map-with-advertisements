'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

export default function Home() {
    const mapRef = useRef(null);

    fetch('data.json')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((marker) => {
                L.marker([marker.lat, marker.lng])
                    .addTo(mapRef.current)
                    .bindPopup(`<b>${marker.title}</b><br>${marker.description}`);
            });
        });

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map', { center: [50.4501, 30.5234], zoom: 13 });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return (
        <div
            id="map"
            style={{ height: '700px' }}></div>
    );
}
