import React, { useEffect, useState } from "react";
import { useGetAddressesQuery, useGetBookingsQuery } from "../../server/APIs";
import { toast, ToastContainer } from "react-toastify";
import { useUpdateApprovalStatusMutation, useDeleteBookingMutation } from "../../server/APIs";
import './RecycleDashboard.css';
import Header from "../Header/Navbar";
import LeftMenu from "./LeftMenu";
import ApprovedBookings from "./ApprovedBookings";
import RejectedBookings from "./RejectedBookings";
import TrashBookings from "./TrashBookings";

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
  facility: string;
  facilityId?: string;
  phone: string;
  address: string;
  approvalStatus: string;
  status?: string;
}

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

const RecycleDashboard: React.FC = () => {
  const { data: bookings, error, isLoading, refetch } = useGetBookingsQuery();
  const { data: facilities } = useGetAddressesQuery();
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [recycleItemPrice, setRecycleItemPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [view, setView] = useState<string>("all");
  const [selectedFacilityDetails, setSelectedFacilityDetails] = useState<Facility | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof Booking | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filtering state
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    refetch(); 
  }, [refetch]);
  
  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, statusFilter, dateRangeFilter]);

  const handleApprove = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }
    console.log("Approving booking ID:", id);
    try {
      await updateApprovalStatus({ id, approvalStatus: "approved" }).unwrap();
      toast.success("Booking approved successfully!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to approve booking: ${errorMessage}`);
    }
  };

  const handleReject = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }
    console.log("Rejecting booking ID:", id);
    try {
      await updateApprovalStatus({ id, approvalStatus: "rejected" }).unwrap();
      toast.success("Booking rejected successfully!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to reject booking: ${errorMessage}`);
    }
  };

  const handleMoveToTrash = async (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid booking ID!");
      return;
    }
    console.log("Moving to trash booking ID:", id);
    try {
      await updateApprovalStatus({ id, approvalStatus: "trashed" }).unwrap();
      toast.success("Booking moved to trash successfully!");
      refetch();
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Failed to move booking to trash: ${errorMessage}`);
    }
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedBrand(booking.brand || "");
    setSelectedModel(booking.recycleItem || "");
    setRecycleItemPrice(booking.recycleItemPrice || "");
    setPickupDate(booking.pickupDate || "");
    setPickupTime(booking.pickupTime || "");
    setAddress(booking.address || "");
    setSelectedFacility(booking.facility || "");
    setPhoneNumber(booking.phone || "");
  };

  const handleCancelEdit = () => {
    setSelectedBooking(null);
  };

  const handleViewFacility = (facilityId: string) => {
    console.log("Looking for facility with ID:", facilityId);
    
    if (!facilities || facilities.length === 0) {
      toast.error("Facility data not available!");
      return;
    }
    
    console.log("Available facilities:", facilities);
    
    const facilityDetails = facilities.find(
      (facility) => {
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
      console.log("All facility IDs:", facilities.map(f => ({ id: f.id, _id: f._id })));
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sorted and filtered data
  const getProcessedBookings = () => {
    if (!bookings) return [];

    // Filter bookings by current view
    let filteredBookings = bookings.filter(booking => 
      view === "all" ? booking.status !== "trashed" : true
    );

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredBookings = filteredBookings.filter(booking =>
        booking.fullName.toLowerCase().includes(searchLower) ||
        booking.userEmail.toLowerCase().includes(searchLower) ||
        booking.brand.toLowerCase().includes(searchLower) ||
        booking.recycleItem.toLowerCase().includes(searchLower) ||
        String(booking.recycleItemPrice).toLowerCase().includes(searchLower) ||
        new Date(booking.pickupDate).toLocaleDateString().toLowerCase().includes(searchLower) ||
        booking.pickupTime.toLowerCase().includes(searchLower) ||
        booking.phone.toLowerCase().includes(searchLower) ||
        (booking.approvalStatus || "pending").toLowerCase().includes(searchLower)
      );
    }

    // Apply brand filter
    if (brandFilter) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.brand.toLowerCase() === brandFilter.toLowerCase()
      );
    }

    // Apply status filter
    if (statusFilter) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.approvalStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date range filter
    if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
      const startDate = new Date(dateRangeFilter.startDate);
      const endDate = new Date(dateRangeFilter.endDate);
      
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.pickupDate);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    // Sort bookings
    if (sortField) {
      filteredBookings = [...filteredBookings].sort((a, b) => {
        if (a[sortField] < b[sortField]) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (a[sortField] > b[sortField]) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredBookings;
  };

  // Get paginated data
  const getPaginatedBookings = () => {
    const processedBookings = getProcessedBookings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return processedBookings.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getProcessedBookings().length / itemsPerPage);

  // Get unique brands for filter
  const getBrands = () => {
    if (!bookings) return [];
    // Alternative approach that doesn't use spread operator with Set
    const brandSet: {[key: string]: boolean} = {};
    bookings.forEach(booking => {
      if (booking.brand) {
        brandSet[booking.brand] = true;
      }
    });
    return Object.keys(brandSet);
  };

  const renderSortIndicator = (field: keyof Booking) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBrandFilter("");
    setStatusFilter("");
    setDateRangeFilter({ startDate: "", endDate: "" });
    setSortField("");
  };

  const renderSearchAndFilters = () => {
    return (
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search....."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* <div className="search-help-text">
            Search across all fields including Price, Pickup Date, Pickup Time, Phone Number and Status
          </div> */}
        </div>
        
        <div className="filters-items-per-page">
        <div className="filters">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Brands</option>
            {getBrands().map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {/* <div className="date-range">
            <input
              type="date"
              value={dateRangeFilter.startDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, startDate: e.target.value})}
              className="date-input"
            />
            <span>To</span>
            <input
              type="date"
              value={dateRangeFilter.endDate}
              onChange={(e) => setDateRangeFilter({...dateRangeFilter, endDate: e.target.value})}
              className="date-input"
            />
          </div> */}
          
          <button onClick={clearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>
        
        <div className="items-per-page">
          <label>Items per page: </label>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="per-page-dropdown"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={50}>50</option>
          </select>
        </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (view) {
      case "approved":
        return <ApprovedBookings />;
      case "rejected":
        return <RejectedBookings />;
      case "trash":
        return <TrashBookings />;
      case "all":
      default:
        const processedBookings = getPaginatedBookings();
        const totalBookings = getProcessedBookings().length;
        
        return (
          <>
            <div className="dataTable clearfix">
              <p className="dashboard-title">Recycle Bookings</p>
              <div className="dashboard-stats">
                <div className="stat-item">
                  <span className="stat-value">{bookings?.length || 0}</span>
                  <span className="stat-label">Total Bookings</span>
                </div>
                {/* <div className="stat-item">
                  <span className="stat-value">{totalBookings}</span>
                  <span className="stat-label">Filtered Bookings</span>
                </div> */}
              </div>
            </div>
            
            {renderSearchAndFilters()}
            
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : processedBookings.length === 0 ? (
              <div className="no-bookings">No bookings found</div>
            ) : error ? (
              <div className="text-red-500">Error: {JSON.stringify(error)}</div>
            ) : (
              <>
                <table className="bookings-table">
                  <thead>
                    <tr className="table-header">
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("fullName")}
                      >
                        Full Name {renderSortIndicator("fullName")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("userEmail")}
                      >
                        Email-Id {renderSortIndicator("userEmail")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("brand")}
                      >
                        Brand {renderSortIndicator("brand")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("recycleItem")}
                      >
                        Model {renderSortIndicator("recycleItem")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("recycleItemPrice")}
                      >
                        Price {renderSortIndicator("recycleItemPrice")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("pickupDate")}
                      >
                        Pickup Date {renderSortIndicator("pickupDate")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("pickupTime")}
                      >
                        Pickup Time {renderSortIndicator("pickupTime")}
                      </th>
                      <th className="table-header-cell">Address</th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("phone")}
                      >
                        Phone Number {renderSortIndicator("phone")}
                      </th>
                      <th 
                        className="table-header-cell sortable"
                        onClick={() => handleSort("approvalStatus")}
                      >
                        Status {renderSortIndicator("approvalStatus")}
                      </th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedBookings.map((booking) => (
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
                        <td className="table-cell">
                          <span className={`status ${booking.approvalStatus}`}>
                            {booking.approvalStatus || "pending"}
                          </span>
                        </td>
                        <td className="table-cell action-buttons">
                          <button
                            onClick={() => booking._id ? handleApprove(booking._id) : toast.error("Invalid booking ID!")}
                            className="approve-button"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => booking._id ? handleReject(booking._id) : toast.error("Invalid booking ID!")}
                            className="reject-button"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => booking._id ? handleMoveToTrash(booking._id) : toast.error("Invalid booking ID!")}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <ToastContainer />
      <div>
        <LeftMenu
          onViewAll={() => setView("all")}
          onViewApproved={() => setView("approved")}
          onViewRejected={() => setView("rejected")}
          onViewTrash={() => setView("trash")}
          activeView={view}
        />
        <div className="dashboard-content">
          {renderContent()}
        </div>
        {selectedBooking && (
          <div className="edit-form-container">
            <h2 className="edit-form-title">Edit Booking</h2>
            <div className="edit-form-grid">
              <input type="text" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="form-input" placeholder="Brand" />
              <input type="text" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="form-input" placeholder="Model" />
              <input type="number" value={recycleItemPrice} onChange={(e) => setRecycleItemPrice(e.target.value)} className="form-input" placeholder="Price" />
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="form-input" />
              <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="form-input" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" placeholder="Location" />
              <input type="text" value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)} className="form-input" placeholder="Facility" />
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input" placeholder="Phone Number" />
            </div>
            <div className="edit-form-buttons">
              <button className="update-button">Update Booking</button>
              <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
            </div>
          </div>
        )}
        {selectedFacilityDetails && (
          <div className="facility-popup">
            <div className="popup-content">
              <h2>{selectedFacilityDetails.name}</h2>
              <p><strong>Address:</strong> {selectedFacilityDetails.address}</p>
              <p><strong>Brand:</strong> {selectedFacilityDetails.brand}</p>
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
    </div>
  );
};

export default RecycleDashboard;