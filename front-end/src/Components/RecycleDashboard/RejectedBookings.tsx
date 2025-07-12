import React, { useEffect, useState } from 'react';
import { useGetAddressesQuery, useGetRejectedBookingsQuery } from "../../server/APIs";
import { toast } from "react-toastify";
import { useUpdateApprovalStatusMutation } from "../../server/APIs";


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


const RejectedBookings: React.FC = () => {
  const { data: rejectedBookings, error, isLoading, refetch } = useGetRejectedBookingsQuery();
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();
  // const { data: facilitys } = useGetAddressesQuery();
      const { data: facilities } = useGetAddressesQuery();
  
  const [selectedFacilityDetails, setSelectedFacilityDetails] = useState<Facility | null>(null);

  useEffect(() => {
    refetch(); 
  }, [refetch]);

  const handleApprove = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }

    try {
      await updateApprovalStatus({ id, approvalStatus: "approved" }).unwrap();
      toast.success("Booking status changed to approved!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to update booking: ${errorMessage}`);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading rejected bookings...</div>;
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
    <div>
      <div className="dataTable clearfix">
        <p className="dashboard-title">Rejected Bookings</p>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{rejectedBookings?.length || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
      </div>
      {rejectedBookings?.length === 0 ? (
        <div className="no-bookings">No rejected bookings found</div>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">Full Name</th>
              <th className="table-header-cell">Email-Id</th>
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
            {rejectedBookings?.map((booking) => (
              <tr key={booking._id} className="table-row">
                <td className="table-cell">{booking.fullName}</td>
                <td className="table-cell">{booking.userEmail}</td>
                <td className="table-cell">{booking.brand}</td>
                <td className="table-cell">{booking.recycleItem}</td>
                <td className="table-cell">{booking.recycleItemPrice}</td>
                <td className="table-cell">{new Date(booking.pickupDate).toLocaleDateString()}</td>
                <td className="table-cell">{booking.pickupTime}</td>
                {/* <td className="table-cell">{booking.address}</td> */}
                <td className="table-cell">
                  <span
                    className="facility-link"
                    onClick={() => handleViewFacility(booking.facility)}
                  >
                    {/* {facility?.find((item) => item.id === booking.facilityId)?.address || "N/A"} */} View Address
                  </span>
                </td>
                <td className="table-cell">{booking.phone}</td>
                <td className="table-cell">
                  <span className="status rejected">Rejected</span>
                </td>
                <td className="table-cell action-buttons">
                  <button onClick={() => booking._id ? handleApprove(booking._id) : toast.error("Invalid booking ID!")} className="approve-button">
                    Change to Approved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedFacilityDetails && (
        <div className="facility-popup">
          <div className="popup-content">
            <h2>{selectedFacilityDetails.name}</h2>
            <p><strong>Address:</strong> {selectedFacilityDetails.address}</p>
            <p><strong>Capacity:</strong> {selectedFacilityDetails.capacity}</p>
            <p><strong>Longitude:</strong> {selectedFacilityDetails.longitude}</p>
            <p><strong>Latitude:</strong> {selectedFacilityDetails.latitude}</p>
            <p><strong>Contact:</strong> {selectedFacilityDetails.contact}</p>
            <p><strong>Time:</strong> {selectedFacilityDetails.time}</p>
            <p><strong>Verified:</strong> {selectedFacilityDetails.verified ? "Yes" : "No"}</p>
            <button onClick={() => setSelectedFacilityDetails(null)} className="close-button">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RejectedBookings;