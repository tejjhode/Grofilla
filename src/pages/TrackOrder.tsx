import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Custom Icons
const bikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Routing Component
const Routing = ({
  userLocation,
  orderLocation,
}: {
  userLocation: { lat: number; lng: number };
  orderLocation: { lat: number; lng: number };
}) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && orderLocation) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(orderLocation.lat, orderLocation.lng),
        ],
        routeWhileDragging: false,
        draggableWaypoints: false,
        addWaypoints: false,
        show: false, // hides default directions box
        createMarker: () => null, // prevents default marker
        lineOptions: {
          styles: [{ color: '#00C853', weight: 5 }],
        },
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map, userLocation, orderLocation]);

  return null;
};

// Main Component
const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [orderLocation, setOrderLocation] = useState({
    lat: 26.20870245125601,
    lng: 78.18941853897715,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await fetch(`https://tejas.yugal.tech/api/tracking/123`);
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
    <div className="w-full h-screen bg-gradient-to-br from-green-50 to-white relative">
      <div className="bg-white shadow-md py-4 text-center text-2xl font-bold text-green-700 sticky top-0 z-10">
        🛵 Live Order Tracking
      </div>

      {userLocation ? (
        <div className="relative h-[85vh] w-full">
          <MapContainer
            center={[orderLocation.lat, orderLocation.lng]}
            zoom={14}
            className="w-full h-full z-0 rounded-lg shadow-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[orderLocation.lat, orderLocation.lng]} icon={bikeIcon}>
              <Popup>Your order is on the way!</Popup>
            </Marker>
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>This is your location</Popup>
            </Marker>
            <Routing userLocation={userLocation} orderLocation={orderLocation} />
          </MapContainer>

          {/* Floating Card */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white rounded-xl p-4 shadow-2xl border border-green-100">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/8062/8062538.png"
                alt="Delivery Guy"
                className="w-12 h-12"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">Your order is being delivered</h3>
                <p className="text-sm text-gray-500">Estimated arrival in 10-15 mins</p>
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-700">
              Delivery from: <span className="font-medium text-green-600">GroFilla Mart</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">Fetching your location...</p>
      )}
    </div>
  );
};

export default TrackOrder;