"use client";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./Contact.css"; // Import custom CSS

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create email subject and body
    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}
    `;

    // Create mailto URL with encoded parameters
    const mailtoUrl = `mailto:epoint1703@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client with prefilled information
    window.open(mailtoUrl, '_blank');
    
    // Show success message
    toast.success("Message form ready to send!");
    
    // Reset form after short delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <> 
    <Header />
    <title>ELocate - Contact Us</title>
    <div className="contact-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />

      <div className="contact-header">
        <div className="contact-title">Contact Us</div>
        <div className="contact-subtitle">
          Have questions or inquiries? Get in touch with us!
        </div>
      </div>

      <div className="contact-wrapper">
        <div className="contact-form-container">
          <div className="contact-form-card">
            <h3 className="contact-form-title">
              Send us a Message
            </h3>
            <form
              className="contact-form"
              onSubmit={SendMsg}
            >
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  // placeholder="John Doe"
                  required />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  // placeholder="johndoe@example.com"
                  required />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Your Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  // placeholder="+91 98765 43210"
                  required />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="form-textarea"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="submit-button-contact"
                disabled={isSubmitting}
              >
                <span className="button-text">{isSubmitting ? "Sending..." : "Send Message"}</span>
                <span className="button-icon-contact">→</span>
              </button>
            </form>
          </div>
        </div>

        <div className="contact-info-container">
          <div className="contact-info-card">
            <h3 className="contact-info-title">Contact Information</h3>
            
            <div className="contact-info-item">
              <div className="contact-icon">📍</div>
              <div className="contact-detail">
                <h4>Address</h4>
                <address>K Nathiya Tamil Nadu-637 001</address>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon">📞</div>
              <div className="contact-detail">
                <h4>Phone</h4>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="tel:+916384600152"
                  className="contact-link"
                >
                  +91-6384600152
                </Link>
              </div>
            </div>
            
            <div className="contact-info-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-detail">
                <h4>Email</h4>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="mailto:epoint1703@gmail.com"
                  className="contact-link"
                >
                  epoint1703@gmail.com
                  {/* ragunathragunath3274@gmail.com */}
                </Link>
              </div>
            </div>
            
            <div className="social-media">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <Link to="/" target="_blank" rel="noopener noreferrer" className="social-icons">
                  <div className="icon-circle">in</div>
                </Link>
                <Link to="/" target="_blank" rel="noopener noreferrer" className="social-icons">
                  <div className="icon-circle">ig</div>
                </Link>
                <Link to="/" target="_blank" rel="noopener noreferrer" className="social-icons">
                  <div className="icon-circle">tw</div>
                </Link>
                <Link to="/" target="_blank" rel="noopener noreferrer" className="social-icons">
                  <div className="icon-circle">wa</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;