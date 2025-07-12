"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LngLatBoundsLike,
  LngLatLike,
  Map,
  Popup,
  Marker
} from "mapbox-gl";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";
import getLocation from "../utils/getLocation";
import { calculateDistance } from "../utils/calculateLocation";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '../../server/APIs';
import './Efacility.css'
import Efacility_Img from "../../Assets/Efacility-img.jpg"
import Header from "../Header/Navbar";


interface Feature {
  geometry: {
    type: 'Point';
    coordinates: number[];
  };
}

interface Facility {
  _id?: string;
  name: string;
  address: string;
  capacity: string;
  longitude: string;
  latitude: string;
  contact: string;
  time: string;
  verified: boolean;
  distance?: number;
}

const FacilityMap: React.FC = () => {
  const [facilityData, setFacilityData] = useState<Facility[]>([]);
  const [clientLocation, setClientLocation] = useState<[number, number] | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Marker[]>([]);
  const mapRef = useRef<Map | null>(null);
  const navigate = useNavigate();
  const userMarkerRef = useRef<Marker | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [newAddress, setNewAddress] = useState<Facility>({
    name: "",
    address: "",
    capacity: "",
    longitude: "",
    latitude: "",
    contact: "",
    time: "",
    verified: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAddress, setEditedAddress] = useState<Facility>({ ...newAddress });
  const { data: facility, refetch } = useGetAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [selectedFacilityForDirections, setSelectedFacilityForDirections] = useState<Facility | null>(null);

  const mapboxAccessToken = "pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw";

  function isPointGeometry(geometry: any): geometry is { type: 'Point'; coordinates: number[] } {
    return geometry && geometry.type === 'Point';
  }

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const coordinates = await getLocation();
        if (coordinates) {
          setClientLocation(coordinates.coordinates);
        } else {
          setClientLocation([75.7139, 19.7515]);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setClientLocation([75.7139, 19.7515]);
      }
    };

    initializeLocation();
  }, []);

  useEffect(() => {
    if (!clientLocation) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: clientLocation,
      zoom: 10,
    });

    map.on('click', 'directions', (e) => {
      if (e.features?.length && e.features[0].geometry) {
        const feature = e.features[0];

        if (isPointGeometry(feature.geometry)) {
          const coordinates = feature.geometry.coordinates;

          if (coordinates.length === 2 &&
            typeof coordinates[0] === 'number' &&
            typeof coordinates[1] === 'number') {

            mapRef.current?.flyTo({
              center: coordinates as [number, number],
              essential: true,
            });
          }
        }
      }
    });

    mapRef.current = map;

    const userMarker = new Marker({ color: "#256dd9" })
      .setLngLat(clientLocation)
      .addTo(map);

    userMarkerRef.current = userMarker;
    map?.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxAccessToken,
      mapboxgl: mapboxgl as any,
    });
    map?.addControl(geocoder);
    geocoder.on("result", (event) => {
      const { geometry, place_name } = event.result;
      if (!geometry || !geometry.coordinates) return;
      const center = geometry.coordinates;
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      const selectedLocationMarker = new Marker()
        .setLngLat(center)
        .addTo(map);

      const popup = new Popup().setHTML(
        `<h3 class="font-bold text-emerald-600 text-2xl">Selected Location</h3>
         <p>Address: ${place_name || "Address not available"}</p>`
      );

      selectedLocationMarker.setPopup(popup);
    });

    return () => {
      map.remove();
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [clientLocation]);


  useEffect(() => {
    if (!facility || !clientLocation) return;

    const sortedFacilities = facility.map((fac) => ({
      ...fac,
      distance: calculateDistance(
        clientLocation[1],
        clientLocation[0],
        parseFloat(fac.latitude),
        parseFloat(fac.longitude)
      )
    })).sort((a, b) => a.distance! - b.distance!);

    setFacilityData(sortedFacilities);

    if (mapRef?.current && markersRef?.current?.length === 0) {
      sortedFacilities?.forEach((fac, index) => {
        const latitude = parseFloat(fac.latitude);
        const longitude = parseFloat(fac.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          console.warn(`Invalid coordinates for facility ${fac.name}:`, fac);
          return;
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          console.warn(`Out-of-bounds coordinates for facility ${fac.name}:`,
            { latitude, longitude });
          return;
        }

        const popup = new Popup()?.setHTML(`
          <h3 class="font-bold text-emerald-600 text-2xl">${fac.name}</h3>
          <p>Capacity: ${fac.capacity}</p>
          <p>Address: ${fac.address}</p>
          <p class="text-gray-600">Contact: ${fac.contact}</p>
          <p class="text-gray-600">Time: ${fac.time}</p>
          <p class="text-gray-600">Distance: ${fac.distance?.toFixed(2)} km away</p>
        `);

        const marker = new Marker({
          color: selectedFacility === index ? "#02703f" : "#22b371",
        })
          ?.setLngLat([longitude, latitude])
          ?.setPopup(popup);

        marker?.addTo(mapRef.current!);
        markersRef?.current?.push(marker);

        marker.getElement().addEventListener("click", () => {
          setSelectedFacility(index);
          popup.addTo(mapRef.current!);
        });
      });
    }
  }, [facility, clientLocation]);

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.address) {
      alert("Name and Address are required");
      return;
    }

    try {
      await createAddress({
        ...newAddress,
        capacity: parseInt(newAddress.capacity),
        longitude: parseFloat(newAddress.longitude),
        latitude: parseFloat(newAddress.latitude)
      });
      refetch();
      setNewAddress({
        name: "",
        address: "",
        capacity: "",
        longitude: "",
        latitude: "",
        contact: "",
        time: "",
        verified: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleUpdateAddress = async (id: string) => {
    try {
      await updateAddress({
        id,
        addressData: {
          ...editedAddress,
          capacity: parseInt(editedAddress.capacity),
          longitude: parseFloat(editedAddress.longitude),
          latitude: parseFloat(editedAddress.latitude)
        }
      });
      refetch();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      refetch();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAllowLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for location.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            default:
              console.error('An unknown error occurred.');
              break;
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleGetDirections = (facility: Facility) => {
    if (!clientLocation) return;

    getDirections(
      clientLocation,
      [parseFloat(facility.longitude), parseFloat(facility.latitude)]
    );
  };

  const getDirections = async (
    origin: [number, number],
    destination: [number, number]
  ) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxAccessToken}`
      );
      const data = await response.json();

      if (data.code === "Ok" && mapRef.current) {
        const distanceInKm = data.routes[0].distance / 1000;
        const directionsLayerId = "directions";

        if (mapRef.current.getLayer(directionsLayerId)) {
          mapRef.current.removeLayer(directionsLayerId);
          mapRef.current.removeSource(directionsLayerId);
        }

        mapRef.current.addSource(directionsLayerId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: data.routes[0].geometry,
          },
        });

        mapRef.current.addLayer({
          id: directionsLayerId,
          type: "line",
          source: directionsLayerId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });

        const bounds = new mapboxgl.LngLatBounds();
        data.routes[0].geometry.coordinates.forEach((coord: [number, number]) =>
          bounds.extend(coord)
        );
        mapRef.current.fitBounds(bounds, { padding: 20 });

        const routePopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          className: "h-8",
        })
          .setLngLat(data.routes[0].geometry.coordinates[0])
          .setHTML(
            `<p class="text-lg">Distance to Nearest Facility: ${distanceInKm.toFixed(2)} km</p>`
          )
          .addTo(mapRef.current!);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };


  return (
    <>
      <Header />
      <div className="containers">
        {/* Facility Management Panel */}
        <div className="address-container">
          {!showAddAddressForm ? (
            <div className="Address-List">
              <h2 className="Address-h2">Address-List</h2>
              <button
                onClick={() => setShowAddAddressForm(true)}
                className="btn-md btn-primary"
              >
                Add New Address
              </button>
            </div>
          ) : (

            <div className="address-formContainer">
              <div className="address-form-container">
                <div className="address-image-container">
                  <img src={Efacility_Img} alt="Location" />
                </div>

                <div className="address-form">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={newAddress.capacity}
                    onChange={(e) => setNewAddress({ ...newAddress, capacity: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={newAddress.longitude}
                    onChange={(e) => setNewAddress({ ...newAddress, longitude: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={newAddress.latitude}
                    onChange={(e) => setNewAddress({ ...newAddress, latitude: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Contact"
                    value={newAddress.contact}
                    onChange={(e) => setNewAddress({ ...newAddress, contact: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Time"
                    value={newAddress.time}
                    onChange={(e) => setNewAddress({ ...newAddress, time: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newAddress.verified}
                      onChange={(e) => setNewAddress({ ...newAddress, verified: e.target.checked })}
                    />
                    <label>Verified</label>
                  </div>

                  <div className="address-buttons">
                    <button
                      onClick={handleAddAddress}
                      className="add-btn"
                    >
                      Add Address
                    </button>
                    <button
                      onClick={() => setShowAddAddressForm(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {clientLocation && (
            <ul className="mt-6 space-y-4">
              {facility?.map((addr) => (
                <li key={addr?._id}>
                  {editingId === addr?._id ? (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <input
                        type="text"
                        placeholder="Name"
                        value={editedAddress.name}
                        onChange={(e) => setEditedAddress({ ...editedAddress, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="Capacity"
                        value={editedAddress.capacity}
                        onChange={(e) => setEditedAddress({ ...editedAddress, capacity: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="Longitude"
                        value={editedAddress.longitude}
                        onChange={(e) => setEditedAddress({ ...editedAddress, longitude: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="number"
                        placeholder="Latitude"
                        value={editedAddress.latitude}
                        onChange={(e) => setEditedAddress({ ...editedAddress, latitude: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Contact"
                        value={editedAddress.contact}
                        onChange={(e) => setEditedAddress({ ...editedAddress, contact: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Time"
                        value={editedAddress.time}
                        onChange={(e) => setEditedAddress({ ...editedAddress, time: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editedAddress.verified}
                          onChange={(e) => setEditedAddress({ ...editedAddress, verified: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <label>Verified</label>
                      </div>

                      <button
                        onClick={() => handleUpdateAddress(addr._id!)}
                        className="btn-md btn-primary"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="btn-md btn-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="details-Address">

                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">{addr.name}</h2>
                        {/* {addr.verified ? (
                      <FaCheckCircle className="text-green-500 w-6 h-6" />
                    ) : (
                      <FaTimesCircle className="text-red-500 w-6 h-6" />
                    )} */}
                      </div>
                      <p className="text-gray-600">{addr?.address}</p>
                      <div className="mt-2">
                        <p className="text-lg text-gray-600">Contact: {addr?.contact}</p>
                        <p className="text-lg text-gray-600">Time: {addr?.time}</p>
                        <p className="text-lg pb-2 text-gray-600">
                          Distance: {(calculateDistance(
                            clientLocation![1],
                            clientLocation![0],
                            parseFloat(addr?.latitude),
                            parseFloat(addr?.longitude)
                          ))?.toFixed(2)} Km away
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGetDirections(addr)}
                          className="btn-md btn-primary"
                          id={`directionsBtn${addr.id ?? addr.street}`}
                        >
                          Get Directions
                        </button>
                        <button onClick={() => navigate("/recycle")} className="btn-md btn-primary">
                          Locate Center
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr._id!)}
                          className="btn-md btn-primary"
                        >
                          Delete
                        </button>
                        {/* <button
                      onClick={() => setEditingId(addr._id)}
                      className="btn-md btn-primary"
                    >
                      Edit
                    </button> */}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {clientLocation && (
          <div ref={mapContainerRef} id="map" className="flex-1 m-4 min-h-[400px]" />
        )}

        {!clientLocation && (
          <div className="flex flex-col items-center justify-center px-10">
            <div className="text-black section-subtitle-error text-center font-bold text-2xl md:text-4xl 2xl:text-6xl uppercase tracking-widest teamHeadingText">
              Location access denied. Please enable location services.
            </div>
            <div className="text-black text-center text-xl md:text-3xl mt-4">
              Please allow the location permissions...
            </div>
            <button
              onClick={handleAllowLocationClick}
              className="bg-emerald-500 text-white font-bold text-xl py-3 px-6 mt-8 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Allow Location
            </button>
          </div>
        )}
      </div>
    </>
  );
};


export default FacilityMap;