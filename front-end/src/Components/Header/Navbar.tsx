// src/Components/Navbar/Header.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from '../../Assets/logo2.png';

interface NavItemProps {
  label: string;
}

const Header: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isNavbarActive, setIsNavbarActive] = useState<boolean>(false);
  const [isHeaderActive, setIsHeaderActive] = useState<boolean>(false);
  const [locations, setLocation] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleToggleDropdown = (): void => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    document.documentElement.classList.remove('no-js');

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=pk.eyJ1Ijoic2h1ZW5jZSIsImEiOiJjbG9wcmt3czMwYnZsMmtvNnpmNTRqdnl6In0.vLBhYMBZBl2kaOh1Fh44Bw`)
            .then(response => response.json())
            .then(data => {
              const city = data.features[0].context.find((context: { id: string | string[]; }) => context.id.includes('place')).text;
              const state = data.features[0].context.find((context: { id: string | string[]; }) => context.id.includes('region')).text;
              setLocation(`${city}, ${state}`);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        },
        (error) => {
          console.error(error);
        },
        options
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 100) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleNavbar = (): void => {
    setIsNavbarActive(!isNavbarActive);
  };

  return (
    <header className={`header ${isHeaderActive ? "active" : ""}`} data-header>
      <div className="container shadow-md">

      <div className="wrapper flex items-center gap-2">
  <Link to="/" className="logo flex items-center gap-2">
    <img src={logo} alt="E-Point Logo" className="w-10 h-10 object-contain" />
    <span className="font-bold text-lg md:text-xl text-emerald-600">E -Point</span>
  </Link>
  <button
    className="nav-close-btn"
    aria-label="close menu"
    data-nav-toggler
    onClick={toggleNavbar}
  >
    {/* Close Icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${isNavbarActive ? "" : "hidden"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>




        <nav className={`navbar ${isNavbarActive ? "active" : ""}`} data-navbar>
         
          <ul className="navbar-list">
            <NavItem label="Home" />
            <NavItem label="About" />
            {currentUser && (
              <>
                <NavItem label="E-Facilities" />
                <NavItem label="Recycle" />
              </>
            )}
            {isAdmin && (
              <NavItem label="Dashboard" />
            )}
            <NavItem label="Contact" />
          </ul>
        </nav>
        <div>
        <h1 className='font-montserrat font-bold text-xl ml-12 md:ml-4 md:text-2xl text-emerald-600 flex items-center gap-[1vh]' id="locations-text">
          {/* Location Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {locations || 'Loading...'}
        </h1>
        </div>
        {currentUser ? (
          <div className="relative">
            <button
              className="md:mr-8 text-sm md:text-xl font-semibold"
              onClick={handleToggleDropdown}
            >
              {currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white p-4 shadow-md divide-y rounded-lg w-44 mt-2 z-50">
                <div className="py-2">
                  <Link to="/profile" className="block hover:text-emerald-500">
                    Profile
                  </Link>
                </div>
                <div className="py-2">
                  <button
                    className="block w-full text-left hover:text-emerald-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2 mr-4">
            <Link to="/login" className="btn-md btn-outline md:mr-2">
              Login
            </Link>
            <Link to="/register" className="btn-md bg-emerald-600 text-white hover:bg-emerald-700">
              Sign Up
            </Link>
          </div>
        )}
        
        <button
          className="nav-open-btn"
          aria-label="open menu"
          data-nav-toggler
          onClick={toggleNavbar}
        >
          {/* Menu Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div
          className={`overlay ${isNavbarActive ? "active" : ""}`}
          data-nav-toggler
          data-overlay
          onClick={toggleNavbar}
        ></div>
      </div>
    </header>
  );
};

const NavItem: React.FC<NavItemProps> = ({ label }) => {
  return (
    <li className="navbar-link">
      <Link to={label === "Home" ? "/" : `/${label.toLowerCase()}`}>
        {label}
      </Link>
    </li>
  );
};

export default Header;