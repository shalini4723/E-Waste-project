import React from "react";
import "./LeftMenu.css";

interface LeftMenuProps {
  onViewAll: () => void;
  onViewApproved: () => void;
  onViewRejected: () => void;
  onViewTrash: () => void;
  activeView: string;
}

const LeftMenu: React.FC<LeftMenuProps> = ({
  onViewAll,
  onViewApproved,
  onViewRejected,
  onViewTrash,
  activeView
}) => {
  return (
    <div className="left-menu">
      <ul>
        <li
          onClick={onViewAll}
          className={`menu-item ${activeView === "all" ? "active" : ""}`}
        >
          All Bookings
        </li>
        <li
          onClick={onViewApproved}
          className={`menu-item ${activeView === "approved" ? "active" : ""}`}
        >
          Approved Bookings
        </li>
        <li
          onClick={onViewRejected}
          className={`menu-item ${activeView === "rejected" ? "active" : ""}`}
        >
          Rejected Bookings
        </li>
        <li
          onClick={onViewTrash}
          className={`menu-item ${activeView === "trash" ? "active" : ""}`}
        >
          🗑 Trash
        </li>
      </ul>
    </div>
  );
};

export default LeftMenu;
