import React, { useEffect, useState } from 'react';
import { useGetAddressesQuery, useGetApprovedBookingsQuery } from "../../server/APIs";
import { toast } from "react-toastify";
import { useUpdateApprovalStatusMutation } from "../../server/APIs";
import './ApprovedBookings.css'

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

const ApprovedBookings: React.FC = () => {

  const { data: approvedBookings, error, isLoading, refetch } = useGetApprovedBookingsQuery();
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();
  // const { data: facility } = useGetAddressesQuery();
    const { data: facilities } = useGetAddressesQuery();
  const [selectedFacilityDetails, setSelectedFacilityDetails] = useState<Facility | null>(null);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch();
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

    useEffect(() => {
      refetch(); 
    }, [refetch]);

  const handleReject = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }
    try {
      await updateApprovalStatus({ id, approvalStatus: "rejected" }).unwrap();
      toast.success("Booking status changed to rejected!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to update booking: ${errorMessage}`);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading approved bookings...</div>;
  if (error) return <div className="text-red-500">Error: {JSON.stringify(error)}</div>;


  const handleViewFacility = (facilityId: string) => {
    // Add debugging to see what we're searching for
    console.log("Looking for facility with ID:", facilityId);
    
    if (!facilities || facilities.length === 0) {
      toast.error("Facility data not available!");
      return;
    }
    
    console.log("Available facilities:", facilities);
    
    // Check if we need to look for _id or id in the facility data
    const facilityDetails = facilities.find(
      (facility) => {
        // Check all possible ID fields
        const facilityIdMatches = 
          facility._id === facilityId || 
          facility.id === facilityId || 
          (facility._id && facility._id.toString() === facilityId) ||
          (facility.id && facility.id.toString() === facilityId);
          
        if (facilityIdMatches) {
          console.log("Found matching facility:", facility);
        }
        
        return facilityIdMatches;
      }
    );
    
    if (facilityDetails) {
      setSelectedFacilityDetails(facilityDetails);
    } else {
      toast.error(`Facility details not found for ID: ${facilityId}`);
      // Log the IDs of all facilities to help debug
      console.log("All facility IDs:", facilities.map(f => ({ id: f.id, _id: f._id })));
    }
  };



  return (
    <div className="bookings-container">
      <div className="dataTable clearfix">
        <p className="dashboard-title">Approved Bookings</p>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{approvedBookings?.length || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
      </div>
      
      {approvedBookings?.length === 0 ? (
        <div className="no-bookings">
          <i className="far fa-calendar-times"></i>
          <p>No approved bookings found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="bookings-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">Full Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Brand</th>
                <th className="table-header-cell">Model</th>
                <th className="table-header-cell">Price</th>
                <th className="table-header-cell">Pickup Date</th>
                <th className="table-header-cell">Pickup Time</th>
                <th className="table-header-cell">Address</th>
                <th className="table-header-cell">Phone Number</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedBookings?.map((booking) => (
                <tr key={booking._id} className="table-row">
                  <td className="table-cell">{booking.fullName}</td>
                  <td className="table-cell">{booking.userEmail}</td>
                  <td className="table-cell">{booking.brand}</td>
                  <td className="table-cell">{booking.recycleItem}</td>
                  <td className="table-cell price-cell">
                    <span className="price-amount">{booking.recycleItemPrice}</span>
                  </td>
                  <td className="table-cell">
                    {new Date(booking.pickupDate).toLocaleDateString()}
                  </td>
                  <td className="table-cell">{booking.pickupTime}</td>
                  <td className="table-cell">
                    <span
                      className="facility-link"
                      onClick={() => handleViewFacility(booking.facility)}
                    >
                      View Address
                    </span>
                  </td>
                  <td className="table-cell">{booking.phone}</td>
                  <td className="table-cell">
                    <span className="status approved">Approved</span>
                  </td>
                  <td className="table-cell action-buttons">
                    <button 
                      onClick={() => booking._id ? handleReject(booking._id) : toast.error("Invalid booking ID!")} 
                      className="reject-button"
                    >
                      <i className="fas fa-times-circle"></i> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedFacilityDetails && (
        <div className="facility-popup">
          <div className="popup-content">
            <h2>{selectedFacilityDetails.name}</h2>
            <div className="facility-details">
              <p><strong>Address:</strong> {selectedFacilityDetails.address}</p>
              <p><strong>Capacity:</strong> {selectedFacilityDetails.capacity}</p>
              <p><strong>Coordinates:</strong> {selectedFacilityDetails.longitude}, {selectedFacilityDetails.latitude}</p>
              <p><strong>Contact:</strong> {selectedFacilityDetails.contact}</p>
              <p><strong>Operating Hours:</strong> {selectedFacilityDetails.time}</p>
              <p><strong>Verification Status:</strong> 
                <span className={`verification-badge ${selectedFacilityDetails.verified ? 'verified' : 'unverified'}`}>
                  {selectedFacilityDetails.verified ? "Verified" : "Unverified"}
                </span>
              </p>
            </div>
            <button onClick={() => setSelectedFacilityDetails(null)} className="close-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedBookings;