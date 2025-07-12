import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { IonIcon } from "@ionic/react";
// import { play } from "ionicons/icons";
import hero from "../../Assets/hero-logo-new.jpg"; // Ensure correct path
import Smartphone_Img from "../../Assets/Smartphone-img.jpg"
import Laptop_Img from "../../Assets/Laptop-img.jpg"
import Other_Img from "../../Assets/Other-img.jpg"
import Television_Img from "../../Assets/Television-img.jpg"
import Refrigerator_Img from "../../Assets/Refrigerator_Img.jpg"
import Accessories_Img from "../../Assets/Accessories-img.webp"
import '../../App.css';
import Navbar from "../Header/Navbar";
import './Home.css';


const solutions = ["E-Waste Recycling"];

const solutionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const HeroSection: React.FC = () => {
  const [currentSolution, setCurrentSolution] = useState(solutions[0]);

  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const currentIndex = solutions.indexOf(currentSolution);
        const nextIndex = (currentIndex + 1) % solutions.length;
        setCurrentSolution(solutions[nextIndex]);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentSolution]);

  const points = [
    { title: "Smartphone", className: "point-1", image: Smartphone_Img },
    { title: "Laptop", className: "point-2", image: Laptop_Img },
    { title: "Accessories", className: "point-3", image: Accessories_Img },
    { title: "Television", className: "point-4", image: Television_Img },
    { title: "Refrigerator", className: "point-5", image: Refrigerator_Img },
    { title: "Other", className: "point-6", image: Other_Img },
  ];

  return (

    <section className="section hero" id="home" aria-label="hero">
      <Navbar />

      <div className="containers">
        <div className="hero-content text-center">
          <p className="mb-4 hero-subtitle has-before">Welcome to E-Point</p>
          {/* <h1 className="h1 hero-title text-center md:text-start font-bold mb-6">
            Your Smart Hub for Responsible
            <br />
            <motion.span
              className="text-go-green pt-2"
              variants={solutionVariants}
              initial="initial"
              animate="animate"
              key={currentSolution}
            >
              {currentSolution}
            </motion.span>
          </h1> */}
          <h1 className="h1 hero-title text-center md:text-start font-bold mb-6">
            Your Smart Hub for Responsible
            <br />
            <span className="text-go-green pt-2 solution-text">
              {currentSolution}
            </span>
          </h1>
          <p className="p-tag">
            E-Point is redefining sustainability by making e-waste disposal effortless
            and eco-friendly. Find the nearest recycling points, contribute to a
            greener future, and be a part of the circular economy—because every device
            deserves a second chance.
          </p>

          <div className="flex flex-row md:flex-row items-center justify-center md:justify-start sm:space-y-0 md:space-x-4 mb-10" id="home-btn">
            <Link to="/recycle" className="btn btn-primary mr-4" id="Recycling-btn">
              Start Recycling
            </Link>
            <Link to="/e-facilities" className="btn btn-primary mr-4" id="Center-btn">
              Locate Center
            </Link>

            {/* <Link to="#" className="flex items-center text-primary">
              <div className="btn-icon mr-2">
                <IonIcon icon={play} aria-hidden="true" role="img" className="md hydrated" />
              </div>
              <span className="font-semibold ml-4">How it works</span>
            </Link> */}
          </div>
        </div>
        {/* 
        <div className="hero-banner has-before img-holder mx-auto mb-16">
          <img src={hero} alt="hero banner" width={650} height={650} className="object-cover" />
        </div> */}

        <div className="natural-places-container">
          <div className="center-hexagon">
            <div className="center-text">E-Waste<br />Recycling</div>
          </div>

          {points.map((point, index) => (
            <div key={index} className={`image-point ${point.className}`}>
              <div className="title">{point.title}</div>
              <div className="arc"></div>
              <div className="image-circle">
                <img src={point.image} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
