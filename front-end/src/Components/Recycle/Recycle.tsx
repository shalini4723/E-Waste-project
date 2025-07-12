import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Navbar";
import './Recycle.css';

import Smart_Phone from "../../Assets/smartphone-icon.png";
import Laptop_icon from "../../Assets/laptop-icon.png";
import Head_Phone from "../../Assets/headphone-icon.png";
import Tv_icon from "../../Assets/tv-icon.png";
import Refrigerator_icon from "../../Assets/refrigerator-icon.png";
import Other_icon from "../../Assets/other-icon.png";

import Smartphone_Img from "../../Assets/Smartphone-img.jpg";
import Laptop_Img from "../../Assets/Laptop-img.jpg";
import Other_Img from "../../Assets/Other-img.jpg";
import Television_Img from "../../Assets/Television-img.jpg";
import Refrigerator_Img from "../../Assets/Refrigerator_Img.jpg";
import Accessories_Img from "../../Assets/Accessories-img.webp";

interface RecycleCardProps {
  itemName: string;
  description: string;
  recyclingProcess: string;
  specialInstructions: string;
  icon: React.ReactNode;
  image: string;
}

const Recycle: React.FC = () => {
  const recycleItems: RecycleCardProps[] = [
    {
      itemName: "Smartphone",
      description: "Your old smartphone holds more than memories.",
      recyclingProcess:
        "We carefully dismantle and recycle each component to reduce e-waste and recover precious metals.",
      specialInstructions:
        "Before you recycle: Wipe your data and remove the SIM card.",
      icon: <img src={Smart_Phone} alt="Smartphone" className="icon-Recycle" />,
      image: Smartphone_Img,
    },
    {
      itemName: "Laptop",
      description: "Your laptop’s journey doesn’t end when you stop using it.",
      recyclingProcess:
        "From circuit boards to screens, we recover and repurpose valuable components responsibly.",
      specialInstructions: "Before you recycle: Remove personal data and detachable batteries.",
      icon: <img src={Laptop_icon} alt="Laptop" className="icon-Recycle" />,
      image: Laptop_Img,
    },
    {
      itemName: "Accessories",
      description: "Recycle various electronic accessories responsibly.",
      recyclingProcess:
        "We separate and recycle different materials for each accessory.",
      specialInstructions: "Bundle cables together before dropping off.",
      icon: <img src={Head_Phone} alt="Accessories" className="icon-Recycle" />,
      image: Accessories_Img,
    },
    {
      itemName: "Television",
      description: "Old TVs may be outdated, but their materials are still valuable!",
      recyclingProcess:
        "We safely extract electronic parts, plastics, and glass to minimize waste.",
      specialInstructions:
        "Before you recycle: Bring remote controls and cables for complete recycling.",
      icon: <img src={Tv_icon} alt="Television" className="icon-Recycle" />,
      image: Television_Img,
    },
    {
      itemName: "Refrigerator",
      description: "Your fridge kept things fresh—now let’s give it a fresh start!",
      recyclingProcess:
        "We handle refrigerant gases, metals, and insulation safely, ensuring eco-friendly disposal.",
      specialInstructions:
        "Before you recycle: Empty, clean, and defrost your fridge.",
      icon: <img src={Refrigerator_icon} alt="Refrigerator" className="icon-Recycle" />,
      image: Refrigerator_Img,
    },
    {
      itemName: "Other",
      description: "Responsible recycling of any other Electronic Devices.",
      recyclingProcess:
        "Proper dismantling and recycling of metal and electronic components.",
      specialInstructions: "Ensure it's not working before recycling.",
      icon: <img src={Other_icon} alt="Other" className="icon-Recycle" />,
      image: Other_Img,
    },
  ];

  return (
    <div className="section container">
      <h2 className="text-4xl text-emerald-700 text-center md:text-left font-bold mb-4">
        Recycle Center
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-1">
        {recycleItems.map((item, index) => (
          <RecycleCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

const RecycleCard: React.FC<RecycleCardProps> = ({
  itemName,
  description,
  recyclingProcess,
  specialInstructions,
  icon,
  image,
}) => {

  return (
    <>
      <Header />
      <div className="profile-cards p-4 m-4 bg-white shadow-lg rounded-md flex justify-between items-center">

        <div className="quote-bubble">
          <div className="quote-icon">"</div>
        </div>

        <div className="content">
          <h3 className="text-xl font-semibold mb-2">{itemName}</h3>
          <p className="text-gray-600">{description}</p>
          <p className="text-gray-600">{recyclingProcess}</p>
          <p className="text-gray-600">{specialInstructions}</p>

          <Link
            to={`/recycle/${itemName.toLowerCase()}`}
            className="btn-md btn-primary mt-2"
            id="recyle-btn"
          >
            Recycle Now
          </Link>
        </div>

        <div className="profile-container">
          <div className="hexagon-top"><span>E-Point</span></div>
          <img src={image} alt={itemName} className="profile-image" />
          <div className="hexagon-bottom"></div>
        </div>
      </div>
    </>
  );
};

export default Recycle;
