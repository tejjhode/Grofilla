import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const bikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Routing = ({ userLocation, orderLocation }: { userLocation: { lat: number, lng: number }, orderLocation: { lat: number, lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && orderLocation) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(orderLocation.lat, orderLocation.lng),
        ],
        routeWhileDragging: true,
        createMarker: () => null, // Remove default markers to keep only custom ones
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map, userLocation, orderLocation]);

  return null;
};

const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderLocation, setOrderLocation] = useState<{ lat: number; lng: number }>({ lat: 26.2183, lng: 78.1828 }); // Default: Gwalior
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`http://localhost:8080//api/tracking/123dç`);
        if (!response.ok) throw new Error('Failed to fetch tracking data');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setOrderLocation({ lat: data.latitude, lng: data.longitude });
        }
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      }
    };

    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Error getting user location:', error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <div className="w-full h-screen ">
      <h2 className="text-2xl font-bold text-center py-4 bg-white shadow-lg">Track Your Order</h2>
      {userLocation ? (
        <MapContainer center={[orderLocation.lat, orderLocation.lng]} zoom={15} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[orderLocation.lat, orderLocation.lng]} icon={bikeIcon}>
            <Popup>Your order is here!</Popup>
          </Marker>
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
          <Routing userLocation={userLocation} orderLocation={orderLocation} />
        </MapContainer>
      ) : (
        <p className="text-center text-gray-500">Loading order location...</p>
      )}
    </div>
  );
};

export default TrackOrder;