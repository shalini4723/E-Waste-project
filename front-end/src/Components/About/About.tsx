import React from "react";
import Header from "../Header/Navbar";
// import feature from "../../assets/features/banner.svg"; // Ensure the path is correct
// import { Link } from "react-router-dom";
import './About.css';
import about from "../../Assets/About.jpg"
import { Link } from "react-router-dom";
import hero from "../../Assets/hero-logo-new.jpg"; 
import dumpster_Icon from "../../Assets/dumpster.png"
import wasteCollection_Icon from "../../Assets/recycle-bin.png"
import pickupSchedule_Icon from "../../Assets/pickup-time.png"

const About = () => {
  return (
    <>
    <Header />
    <section className="about-container section" id="about" aria-label="about">
      <div className="banner-container">
        <img src={about} alt="E-Point Recycling" className="banner-image object-cover rounded-lg" />
        {/* <div className="banner-text">
          <h2>- About -<span>E-Point</span></h2>
        </div> */}
        <section className="banner-text">
        <div className="services-wrapper">
            <div className="service-item">
                <div className="service-icon">
                    <img src={dumpster_Icon} alt="Dumpster Sizes Icon" />
                </div>
                <div className="service-content">
                    <h3 className="service-title">Dumpster Sizes</h3>
                    <p className="service-description">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt...</p>
                </div>
            </div>

            <div className="service-item">
                <div className="service-icon">
                    <img src={wasteCollection_Icon} alt="Waste Collection Icon" />
                </div>
                <div className="service-content">
                    <h3 className="service-title">Waste Collection</h3>
                    <p className="service-description">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt...</p>
                </div>
            </div>

            <div className="service-item">
                <div className="service-icon">
                    <img src={pickupSchedule_Icon} alt="Pickup Schedule Icon" />
                </div>
                <div className="service-content">
                    <h3 className="service-title">Pickup Schedule</h3>
                    <p className="service-description">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt...</p>
                </div>
            </div>
        </div>
    </section>
      </div>

      <div className="container" id="container-About">
      <div className="explore-cakes">
              Revolutionizing E-Point Locator and Management
        </div>
          
          <div className="image-section">
            <p className="text-gray-600 text-lg leading-relaxed">
              In India, the improper disposal of e-point contributes to the alarming annual 
              collection of 1.71 million metric tons. Locating trustworthy e-point collection 
              facilities remains a significant challenge, intensifying this environmental issue.
            </p> <br />
            <p className="text-gray-600 text-lg leading-relaxed">
              The E-Point Web Platform is conceived to directly address this issue. Our platform 
              offers a dynamic, user-friendly interface for individuals and businesses seeking 
              reliable e-point collection facilities.
            </p>
          </div>

          <div className="text-section">
            <h3 className="sustainable-text">Your Sustainable Partner</h3>
            <div className="about-p-tag">
            <p className="text-gray-600 text-lg leading-relaxed">
              At E-Point, we are more than just a recycling platform; we are your trusted 
              partner in responsible e-waste disposal. Our mission is to simplify and streamline 
              the process of recycling electronic waste, making it more accessible to everyone.
            </p> <br />
            <p className="text-gray-600 text-lg leading-relaxed">
              Join us in revolutionizing e-waste management and contributing to a cleaner, 
              greener future. Explore our platform and find the best recycling solutions today.
            </p>
            </div>
            <div className="About-btn">
              <Link to="/contactus" className="btn btn-primary mr-3" id="About-contant">Contact Us</Link>
              <Link to="/recycle" className="btn btn-secondary" id="About-contant">Recycling Services</Link>
            </div>
          </div>
      </div>
    </section>
    </>
  );
};


export default About;


// <div className="about-container">
// <div className="banner-container">
//     <img src={about} alt="Aerial view of real estate properties" className="banner-image" />
//     <div className="banner-text">
//         <h2>Get to Know <span>Us</span></h2>
//     </div>
// </div>

// <div className="content-section">
//     <div className="left-column">
//         <h3>A little bit about</h3>
//         <h2>The Realestate place</h2>
//         <a href="#" className="contact-button">
//             Contact us <span className="arrow">→</span>
//         </a>
//     </div>
    
//     <div className="right-column">
//         <h3>Your local & loyal agent</h3>
//         <p>
//             At The RealEstate Place, we're more than just your local real estate agency; 
//             we're your loyal partners in finding the perfect place to call home. Our 
//             commitment to you goes beyond buying or selling properties – it's about 
//             building lasting relationships within our vibrant community.
//         </p>
//         <p>
//             The RealEstate Place is more than just a real estate agency; we're your 
//             trusted partners in making your real estate dreams a reality. Discover the 
//             difference of working with a team that's as passionate about your goals as 
//             you are. Welcome to The RealEstate Place, where your local and loyal agent 
//             is always here to serve you.
//         </p>
//     </div>
// </div>
// </div>