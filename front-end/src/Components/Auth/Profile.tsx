import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import { 
  useGetBookingsQuery, 
  useGetApprovedBookingsQuery, 
  useGetRejectedBookingsQuery, 
  useGetTrashedBookingsQuery,
  useUpdateApprovalStatusMutation
} from "../../server/APIs"; // Adjust the import path as needed


interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface RecyclingActivity {
  id: string;
  item: string;
  quantity: number;
  date: string;
  time: string;
  status: string; // Use string to accommodate any status including "pending"
}

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    // phone: currentUser?.phone || "",
    // address: currentUser?.address || "",
    // bio: currentUser?.bio || ""
  });
  
  // Using RTK Query hooks to fetch booking data
  const { data: allBookings = [], isLoading: loadingAll } = useGetBookingsQuery();
  const { data: approvedBookings = [], isLoading: loadingApproved } = useGetApprovedBookingsQuery();
  const { data: rejectedBookings = [], isLoading: loadingRejected } = useGetRejectedBookingsQuery();
  const { data: trashedBookings = [], isLoading: loadingTrashed } = useGetTrashedBookingsQuery();
  
  // Mutation for updating approval status
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();

  // Calculate pending bookings
  const pendingBookings = allBookings.filter((booking: any) => 
    booking.approvalStatus === "pending" || !booking.approvalStatus
  );

  // Transform API bookings to RecyclingActivity format
  const [recyclingActivities, setRecyclingActivities] = useState<RecyclingActivity[]>([]);

  useEffect(() => {
    if (!loadingAll && allBookings.length > 0) {
      const formattedActivities = allBookings.map((booking: any) => {
        // Format date and time
        const bookingDate = new Date(booking.createdAt || booking.date);
        const formattedDate = bookingDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const formattedTime = bookingDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        return {
          id: booking._id || booking.id,
          item: booking.itemType || "Recyclable Item",
          quantity: booking.quantity || 1,
          date: formattedDate,
          time: formattedTime,
          status: booking.approvalStatus || "pending"
        };
      });
      
      setRecyclingActivities(formattedActivities);
    }
  }, [allBookings, loadingAll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically update the user profile via an API call
    // For now, we'll just toggle editing mode off
    setIsEditing(false);
    // Show success message or handle errors
  };

  const toggleEdit = (): void => {
    setIsEditing(!isEditing);
  };

  // Function to handle status changes for recycling activities
  const handleStatusChange = async (activityId: string, newStatus: "approved" | "rejected" | "trashed") => {
    try {
      await updateApprovalStatus({ 
        id: activityId, 
        approvalStatus: newStatus 
      }).unwrap();
      
      // Update local state to reflect the change immediately
      setRecyclingActivities(prevActivities => 
        prevActivities.map(activity => 
          activity.id === activityId 
            ? { ...activity, status: newStatus } 
            : activity
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      // Handle error (show notification, etc.)
    }
  };

  // Calculate total recycling points - could be based on approved activities
  const calculateRecyclingPoints = () => {
    const pointsPerItem = 10; // Example: each approved item gives 10 points
    return approvedBookings.reduce((total: number, booking: any) => {
      return total + ((booking.quantity || 1) * pointsPerItem);
    }, 0);
  };

  // Calculate CO2 saved - example calculation
  const calculateCO2Saved = () => {
    const kgCO2PerItem = 2.5; // Example: each recycled item saves 2.5kg of CO2
    return approvedBookings.reduce((total: number, booking: any) => {
      return total + ((booking.quantity || 1) * kgCO2PerItem);
    }, 0);
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    return (
      <span className={`status ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading data...</p>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="not-logged-in">
        <div className="login-prompt">
          <svg className="empty-activity-icon mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="login-message">Please log in to view your profile.</p>
          <Link to="/login" className="login-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (loadingAll || loadingApproved || loadingRejected || loadingTrashed) {
    return <LoadingSpinner />;
  }

  const recyclingPoints = calculateRecyclingPoints();
  const co2Saved = calculateCO2Saved();
  const treesEquivalent = Math.round(co2Saved / 15); // Example: 15kg CO2 = 1 tree

  return (
    <div className="profile-containers">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-header-pattern"></div>
          <div className="profile-header-content">
            <h1 className="profile-title">User Profile</h1>
            <p className="profile-subtitle">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="profile-body">
          <div className="user-info-container">
            <div className="user-info">
              <div className="avatar">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h2 className="user-name">{currentUser.name}</h2>
                <p className="user-email">{currentUser.email}</p>
                <span className="user-role">
                  {currentUser.role === "admin" ? "Administrator" : "User"}
                </span>
              </div>
            </div>
            {!isEditing && (
              <button onClick={toggleEdit} className="edit-button">
                <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <div className="form-row">
                  <label className="form-label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-row">
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={profileData.address}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="form-input"
                  rows={4}
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="stats-container">
                <div className="stat-card">
                  <p className="stat-title">Total Recycling Points</p>
                  <p className="stat-value">{recyclingPoints}</p>
                  <p className="stat-description">
                    <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Based on your approved recycling activities
                  </p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">Recycling Requests</p>
                  <p className="stat-value">{allBookings.length}</p>
                  <p className="stat-description">
                    <StatusBadge status="pending" /> {pendingBookings.length} Pending
                    <span className="mx-2">•</span>
                    <StatusBadge status="approved" /> {approvedBookings.length} Approved
                    <span className="mx-2">•</span>
                    <StatusBadge status="rejected" /> {rejectedBookings.length} Rejected
                  </p>
                </div>
                <div className="stat-card">
                  <p className="stat-title">CO₂ Saved</p>
                  <p className="stat-value">{co2Saved.toFixed(1)} kg</p>
                  <p className="stat-description">Equivalent to planting {treesEquivalent} trees</p>
                </div>
              </div>

              <div className="info-section">
                <h3 className="section-title">
                  <svg className="section-title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <p className="info-label">User ID</p>
                    <p className="info-value">{currentUser.id}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Role</p>
                    <p className="info-value capitalize">{currentUser.role}</p>
                  </div>
                  <div className="info-item">
                    <p className="info-label">Member Since</p>
                    {/* <p className="info-value">{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p> */}
                  </div>
                  <div className="info-item">
                    <p className="info-label">Account Status</p>
                    <p className="info-value">
                      <StatusBadge status="approved" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="activity-section">
                <h3 className="section-title">
                  <svg className="section-title-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recycling Activity
                </h3>
                {recyclingActivities.length > 0 ? (
                  <div className="activity-list">
                    {recyclingActivities.map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div className="activity-details">
                          <div className="activity-header">
                            <p className="activity-title">Recycled {activity.quantity} {activity.item}</p>
                            <StatusBadge status={activity.status} />
                          </div>
                          <p className="activity-meta">{activity.date} • {activity.time}</p>
                          
                          {/* Status action buttons */}
                          <div className="activity-actions">
                            {activity.status !== "approved" && (
                              <button 
                                onClick={() => handleStatusChange(activity.id, "approved")}
                                className="approve-button-profile"
                              >
                                Approve
                              </button>
                            )}
                            {activity.status !== "rejected" && (
                              <button 
                                onClick={() => handleStatusChange(activity.id, "rejected")}
                                className="reject-button"
                              >
                                Reject
                              </button>
                            )}
                            {activity.status !== "trashed" && (
                              <button 
                                onClick={() => handleStatusChange(activity.id, "trashed")}
                                className="delete-button"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                //   <div className="empty-activity">
                //   <svg className="empty-activity-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                //   </svg>
                //   <p className="empty-activity-text">You haven't submitted any recycling requests yet.</p>
                //   <button 
                //     onClick={() => navigate('/recycle')} 
                //     className="start-button"
                //   >
                //     <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                //     </svg>
                //     Start recycling now
                //   </button>
                // </div>
                <></>
                )}
              </div>

              <div className="empty-activity">
                  <svg className="empty-activity-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="empty-activity-text">You haven't submitted any recycling requests yet.</p>
                  <button 
                    onClick={() => navigate('/recycle')} 
                    className="start-button"
                  >
                    <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Start recycling now
                  </button>
                </div>

              <button className="logout-button" onClick={() => {/* Handle logout */}}>
                <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;