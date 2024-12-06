import React, { useState, useEffect } from 'react';
import './home.scoped.css';
import img1 from '../../images/c.jpeg';
import img2 from '../../images/s.jpg';
import img3 from '../../images/abc.jpg';
import img4 from '../../images/12.jpg';
import img5 from '../../images/2.jpg';
import personImg from '../../images/person.png'

function AboutUs() {
  // Array of background images
  const images = [img1, img2, img3, img4, img5];
  // State to manage the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow effect to change the background image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  // List items for the company profile
  const items = [
    'Secure payment options for your peace of mind.',
    ' Highly trained drivers with excellent safety records.',
    'Timely departures and arrivals to ensure you reach your destination on time.',
    'We offer a comprehensive network of scheduled routes, connecting major cities and towns.',
    'Your safety is our priority. We adhere to strict safety protocols and regulations.'
  ];

  return (
    <div className="container">
      {/* Header Section */}
      <header
        className="header"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}>
      </header>

      {/* Company Profile Section */}
      <section className='bookin-section'>
        <div className='profile'>
          <h1>Company Profile........</h1>
          <p className='para'>
            Indika Motors and Transport Private Limited is a leading provider of transport services and vehicle spare parts in Sri Lanka.
            Established in 1998 by Mr. Ranjith Dodangolla, the company has evolved into a trusted name in the industry, serving a broad range of clients
            including major companies like MAS Contourline, Unichela, Okidoki, Nobelswear, Isabella, and Celogen Lanka.
          </p>

          <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left', marginLeft: '6%', marginTop: '-5%' }}>
  {items.map((item, index) => (
    <li key={index} style={{ margin: '8px 0', fontSize: '15px' }}>
      <span style={{ marginRight: '10px', color: 'yellow', fontSize: '12px' }}>🟡</span> {/* Adjust fontSize for checkmark */}
      {item}
    </li>
  ))}
</ul>
        <div className='profile-img'></div>
        </div>

<br></br>
        <h2>How To Booking Our Bus........</h2>
        <section className='booking'>
        <div className='service-box service-box-2'>
          <h4>1. Visit Booking Page</h4>
          <p>
          Experience the enchantment of travel with magiya.lk. Embark on your next bus adventure now!
          </p>
        </div>

        <div className='service-box service-box-2'>
          <h4>2. Search Your Transit</h4>
          <p>
          Choose your pickup, destination, journey date to see available means of transportation.
          </p>
        </div>

        <div className='service-box service-box-2'>
          <h4>3. Reserve Your Seat</h4>
          <p>
          Choose the best ticket to instantly reserve your booking with the comfort of your home.
          </p>
        </div>

        <div className='service-box service-box-2'>
          <h4>4. Complete The Payment</h4>
          <p>
          Pay for your tickets using any major card or even any major cryptocurrency right away and print your tickets with ease.
          </p>
        </div>
        </section>
<br></br><br></br>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div>
          <h2>Who We Are.......</h2>
          <p>
            Founded in 1998 by Mr. Ranjith Dodangolla as a sole proprietorship,
            Indika Motors and Transport Private Limited has evolved into a
            dynamic and successful company in the vehicle spare parts and
            transportation industry. Over the years, the company transitioned
            into a private limited entity, with five directors at the helm,
            namely Mr. Ranjith Dodangolla, his wife Mrs. Manjula Delgahapitiya,
            and their three daughters. Indika Motors and Transport Private
            Limited is recognized for its commitment to delivering high-quality
            vehicle spare parts and reliable transportation services, catering
            to a diverse clientele that includes prominent companies like MAS
            Contourline, Unichela, Okidoki, Nobelswear, Isabella, and Celogen
            Lanka.
          </p>
        </div>
        <img src={personImg} className="person-img-v2"/>
      </section>

      {/* What We Do Section */}
      <section className="services-section">
        <h3>Why Choose Us........</h3>
        <div className="services">
          <div className="service-box">
            <h4>Experienced Drivers</h4>
            <p>
              Our drivers are professionals with years of experience in the transport industry.
              They are not only skilled behind the wheel but also committed to providing safe and
              friendly service to every passenger.
            </p>
          </div>
          <div className="service-box">
            <h4>Efficient Customer Support</h4>
            <p>
              Our dedicated support team is available around the clock to assist you with any queries or issues.
              Whether it’s a booking request or resolving a concern, we're here to ensure your experience with us is seamless.
            </p>
          </div>
          <div className="service-box">
            <h4>Cost-Effective Solutions</h4>
            <p>
              We offer competitive pricing tailored to your transportation needs. With transparent pricing structures, we ensure
              that you receive the best value for your money, whether it's for personal or business transportation.
            </p>
          </div>
        </div>
      </section>


      <div className="get-in-touch-container">
      <h1>GET IN TOUCH</h1>
      <div className="contact-info">
        <div className="contact-item">
          <i className="fas fa-map-marker-alt"></i>
          <h2>ADDRESS</h2>
          <p>Weifield Group Contracting</p>
          <p>6950 S. Jordan Road</p>
          <p>Centennial, CO 80112</p>
          <p>Industrial Division Office</p>
          <p>1270 Automation Drive #500</p>
          <p>Windsor, CO 80550</p>
          <p>Wyoming Office</p>
          <p>308 Southwest Dr Unit E</p>
          <p>Cheyenne, WY 82007</p>
          <p>Texas Office</p>
          <p>1421 Wells Branch Pkwy, Ste 303</p>
          <p>Pflugerville, TX 78660</p>
        </div>

        <div className="contact-item">
          <i className="fas fa-phone"></i>
          <h2>PHONE</h2>
          <p>Weifield Group Contracting</p>
          <p>303.428.2011 phone</p>
          <p>303.202.0466 facsimile</p>
          <p>Weifield 24/7 Service Department</p>
          <p>303.428.2011 (Press 2 for emergency)</p>
          <p>Industrial Division Office</p>
          <p>303.428.2011 phone</p>
          <p>303.202.0466 facsimile</p>
          <p>Wyoming Office</p>
          <p>307.757.7967 phone</p>
          <p>Texas Office</p>
          <p>512.436.9204 phone</p>
        </div>

        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <h2>EMAIL</h2>
          <p>Request for Proposal</p>
          <p>info@weifieldgroup.com</p>
          <p>All Bid Opportunities</p>
          <p>estimating@weifieldgroup.com</p>
          <p>Electrical Service Calls</p>
          <p>service@weifieldcontracting.com</p>
          <p>Employment Opportunities</p>
          <p>careers@weifieldcontracting.com</p>
        </div>
      </div>
    </div>

      <div className='bus'></div>
    </div>
  );
}

export default AboutUs;
