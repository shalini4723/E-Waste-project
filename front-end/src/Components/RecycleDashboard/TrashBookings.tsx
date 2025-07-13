import React, { useEffect, useState } from "react";
import { useGetTrashedBookingsQuery, useDeleteBookingMutation, useGetAddressesQuery, useRestoreBookingMutation } from "../../server/APIs";
import { toast } from "react-toastify";
import './TrashBookings.css';

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

interface Booking {
  _id?: string;
  fullName: string;
  userEmail: string;
  brand: string;
  recycleItem: string;
  recycleItemPrice: string;
  pickupDate: string;
  pickupTime: string;
  facilityId: string;
  phone: string;
  status: string;
  approvalStatus: string;
}

const TrashBookings: React.FC = () => {
  const { data: trashedBookings, isLoading, refetch } = useGetTrashedBookingsQuery();
  const [deleteBooking] = useDeleteBookingMutation();
  const [restoreBooking] = useRestoreBookingMutation();
  // const { data: facility } = useGetAddressesQuery();
      const { data: facilities } = useGetAddressesQuery();

  const [selectedFacilityDetails, setSelectedFacilityDetails] = useState<Facility | null>(null);
  
  // State to manage the popup visibility and selected booking
  const [isDeletePopupVisible, setDeletePopupVisible] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  useEffect(() => {
    refetch(); 
  }, [refetch]);

  // const handlePermanentDelete = async () => {
  //   if (!bookingToDelete) return;
  //   try {
  //     await deleteBooking(bookingToDelete).unwrap();
  //     toast.success("Booking permanently deleted!");
  //     setDeletePopupVisible(false); // Close the popup after successful delete
  //     refetch();
  //   } catch (error) {
  //     const errorMessage = (error as Error).message || JSON.stringify(error);
  //     toast.error(`Failed to delete booking: ${errorMessage}`);
  //   }
  // };

  const handlePermanentDelete = async () => {
  if (!bookingToDelete || typeof bookingToDelete !== "string") {
    toast.error("Invalid booking ID!");
    return;
  }

  try {
    await deleteBooking(bookingToDelete).unwrap();
    toast.success("Booking permanently deleted!");
    setDeletePopupVisible(false); // Close the popup after successful delete
    refetch();
  } catch (error) {
    const errorMessage = (error as Error).message || JSON.stringify(error);
    toast.error(`Failed to delete booking: ${errorMessage}`);
  }
};


  const handleRestore = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }
    try {
      await restoreBooking(id).unwrap();
      toast.success("Booking restored successfully!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to restore booking: ${errorMessage}`);
    }
  };

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

  const openDeletePopup = (id: string) => {
    setBookingToDelete(id); // Set the booking id to delete
    setDeletePopupVisible(true); // Open the delete confirmation popup
  };

  const closeDeletePopup = () => {
    setDeletePopupVisible(false); // Close the delete confirmation popup
    setBookingToDelete(null); // Reset the booking id
  };

  return (
    <>

    <div className="trashed-booking-table">
      <div className="dataTable clearfix">
        <p className="dashboard-title">Trashed Bookings</p>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-value">{trashedBookings?.length || 0}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-8">Loading trashed bookings...</div>
      ) : !trashedBookings || trashedBookings.length === 0 ? (
        <div className="no-bookings">No trashed bookings found</div>
      ) : (
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
              <th className="table-header-cell">Phone</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trashedBookings?.map((booking) => (
              <tr key={booking._id} className="table-row">
                <td className="table-cell">{booking.fullName}</td>
                <td className="table-cell">{booking.userEmail}</td>
                <td className="table-cell">{booking.brand}</td>
                <td className="table-cell">{booking.recycleItem}</td>
                <td className="table-cell">{booking.recycleItemPrice}</td>
                <td className="table-cell">{new Date(booking.pickupDate).toLocaleDateString()}</td>
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
                <td className="table-cell action-buttons">
                  <button
                    onClick={() => booking._id ? handleRestore(booking._id) : toast.error("Invalid booking ID!")}
                    className="approve-button"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => booking._id ? openDeletePopup(booking._id) : toast.error("Invalid booking ID!")}
                    className="delete-button"
                  >
                    Delete Permanently
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



    <div className="delete-popup">
{isDeletePopupVisible && (
 <div className="popup-overlay">
   <div className="popup-contents">
     <p>Are you sure you want to permanently delete this booking? This action cannot be undone.</p>
     <div className="delete-permanetly">
     <button onClick={closeDeletePopup} className="cancel-delete-button">
       Cancel
     </button>
     <button onClick={handlePermanentDelete} className="confirm-delete-button">
       Confirm Delete
     </button>
     </div>
   </div>
 </div>
)}
</div>

</>
  );
};

export default TrashBookings;
