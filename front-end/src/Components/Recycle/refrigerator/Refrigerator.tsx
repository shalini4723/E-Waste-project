import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Refrigerator.css';
import { useCreateBookingMutation, useGetAddressesQuery, useGetlaptopModelsByBrandQuery, useGetlaptopBrandsQuery, useGetModelsByBrandQuery, useGetAccessoriesBrandsQuery, useGetAccessoriesModelsByBrandQuery, useGetRefrigeratorBrandsQuery, useGetRefrigeratorModelsByBrandQuery } from "../../../server/APIs";
import Header from "../../Header/Navbar";

interface Brand {
    brand: string;
    models: string[];
}

interface Facility {
    _id?: string;
    name: string;
    address: string;
    brand: string;
    capacity: string;
    longitude: string;
    latitude: string;
    contact: string;
    time: string;
    verified: boolean;
    distance?: number;
}

interface BookingData {
    userId: string;
    userEmail: string;
    brand: string;
    recycleItem: string;
    recycleItemPrice: number;
    pickupDate: string;
    pickupTime: string;
    facility: string;
    fullName: string;
    address: string;
    phone: string;
}

const Accessories: React.FC = () => {
    const [createBooking] = useCreateBookingMutation();
    const [selectedModel, setSelectedModel] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [recycleItemPrice, setRecycleItemPrice] = useState<number>();
    const [pickupDate, setPickupDate] = useState<string>("");
    const [pickupTime, setPickupTime] = useState<string>("");
    const [address, setAddress] = useState("");
    const [bookingData, setBookingData] = useState<BookingData[]>([]);
    const [facilityData, setFacilityData] = useState<Facility[]>([]);
    const [phone, setPhone] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const { data: facility, refetch } = useGetAddressesQuery();
    const { data: brands, isLoading } = useGetRefrigeratorBrandsQuery();
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const { data: models } = useGetRefrigeratorModelsByBrandQuery(selectedBrand, {
        skip: !selectedBrand,
    });

    if (isLoading) return <p>Loading brands...</p>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!selectedFacility) {
                throw new Error("Please select a facility");
            }
            if (!selectedBrand) {
                throw new Error("Please select a brand");
            }
            if (!selectedModel) {
                throw new Error("Please select a recycle item");
            }
            const facilityObject = facility?.find((f) => f.name === selectedFacility);
            if (!facilityObject || !facilityObject._id) {
                throw new Error("Invalid facility selected");
            }
            const newBooking: BookingData = {
                userId: "user123",
                userEmail,
                brand: selectedBrand,
                recycleItem: selectedModel,
                recycleItemPrice: recycleItemPrice ?? 0,
                pickupDate,
                pickupTime,
                facility: facilityObject._id,
                fullName,
                address,
                phone,
            };
            console.log("Booking Data:", newBooking);
            const response = await createBooking(newBooking);
            console.log("API Response:", response);
            if (!response?.data) {
                throw new Error("Failed to create booking. No response data.");
            }
            toast.success("Booking created successfully!");
            setUserEmail("");
            setFullName("");
            setSelectedBrand("");
            setSelectedModel("");
            setRecycleItemPrice(undefined);
            setPickupDate("");
            setPickupTime("");
            setAddress("");
            setPhone("");
            setSelectedFacility("");
        } catch (error: any) {
            console.error("Booking creation error:", error);
            toast.error(error?.message || "An unexpected error occurred");
        }
    };

    return (
        <div className="smartphone-container">
            <Header />
            <ToastContainer />
            <h1 className="smartphone-title">
                Accessories Recycling
            </h1>
            <form
                className="smartphone-form"
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label className="form-label">
                        Select Brand:
                    </label>
                    <select
                        id="brand"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select Brand</option>
                        {brands?.map((brand) => (
                            <option key={brand.brand} value={brand.brand}>
                                {brand.brand}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedBrand && models && (
                    <div className="form-group">
                        <label className="form-label">
                            Select Model:
                        </label>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select Model</option>
                            {models.map((model, index) => (
                                <option key={index} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Recycle Item Price:
                    </label>
                    <input
                        type="number"
                        id="recycleItemPrice"
                        value={recycleItemPrice}
                        onChange={(e) => setRecycleItemPrice(Number(e.target.value))}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Pickup Date:
                    </label>
                    <input
                        type="date"
                        id="pickupDate"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Pickup Time:
                    </label>
                    <input
                        type="time"
                        id="pickupTime"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Location:
                    </label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Select Facility:
                    </label>
                    <select
                        id="facility"
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select Facility</option>
                        {facility?.map((facility) => (
                            <option key={facility.name} value={facility.name}>
                                {facility.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Accessories;