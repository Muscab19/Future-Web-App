import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import logo from '../assets/Logos.png';
import aboutImage from '../assets/about.jpg'; 
import axios from 'axios';

const Home = () => {
  const [names, setNames] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [name, setName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedPhoto = localStorage.getItem('userPhoto');
    if (storedName) {
      setName(storedName);
    }
    if (storedPhoto) {
      setUserPhoto(storedPhoto);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to format the user's name to uppercase initials
  const formatName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result);
        localStorage.setItem('userPhoto', reader.result); // Store photo in local storage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the token if needed

    try {
      await axios.post('http://localhost:3000/api/message', { 
        name, 
        phone, 
        message 
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token if required
        },
      });
      toast.success('Message sent!'); // Show success toast
      setNames('');  
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message); // Log the error response data for debugging
      toast.error('Failed to send message. Please Signup  or Login and try again.'); // Show error toast
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('userPhoto'); // Remove the user's photo from local storage
    setName('');
    setUserPhoto('');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <header className={`fixed w-full z-10 top-0 transition duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="w-[200px]" />
          </NavLink>
          <nav className="space-x-6">
            <NavLink to="/" className="hover:text-[#F98C2D]">Home</NavLink>
            <NavLink to="/about" className="hover:text-[#F98C2D]">About</NavLink>
            <NavLink to="/services" className="hover:text-[#F98C2D]">Services</NavLink>
            <NavLink to="/projects" className="hover:text-[#F98C2D]">Projects</NavLink>
            <NavLink to="/contact" className="hover:text-[#F98C2D]">Contact</NavLink>
          </nav>
          <div className="space-x-4 flex items-center">
            {name ? (
              <>
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#F98C2D] cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => document.getElementById('file-input').click()} // Trigger upload on click
                  />
                ) : (
                  <button
                    className="text-2xl font-semibold bg-[#F98C2D] py-2 px-4 rounded-full text-white cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => document.getElementById('file-input').click()} // Trigger upload on click
                  >
                    {formatName(name)}
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-input"
                />
                <button onClick={handleLogout} className="bg-[#A51B2B] text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/signIn">
                  <button className="bg-[#A51B2B] text-white px-4 py-2 rounded hover:bg-red-600">Log In</button>
                </NavLink>
                <NavLink to="/signUp">
                  <button className="border border-[#F98C2D] text-[#A51B2B] px-4 py-2 rounded hover:bg-[#F98C2D] hover:text-white">Sign Up</button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://your-futuristic-background-image-url)' }}>
        <div className="absolute inset-0 bg-transparent"></div> {/* Clear overlay */}
        <div className="relative z-10 text-center text-gray-800">
          <h1 className="text-5xl md:text-7xl mx-4 font-bold text-[#A51B2B]">Where Quality Repair Meets Quality Products</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">Fix It Right the First Time with Our Expert Team</p>
          <button className="mt-8 bg-[#F98C2D] text-black font-semibold py-3 px-6 rounded hover:bg-[#F98C2D]">
            Explore Our Services
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-[#A51B2B] mb-4 text-center">About Us</h2>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img src={aboutImage} alt="About Us" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2 ml-10">
            <h3 className="text-xl font-bold text-[#A51B2B]">Who We Are</h3>
            <h4 className="text-lg font-semibold">Fast Service at Computer & Device Repair</h4>
            <p className="text-gray-700 mb-6">
              We specialize in quick and reliable repairs for computers, printers, monitors, and more, ensuring you get back to work as soon as possible.
            </p>

            <h3 className="text-xl font-bold text-[#A51B2B]">Why Trust Us?</h3>
            <h4 className="text-lg font-semibold">Quality Repairs You Can Count On</h4>
            <p className="text-gray-700 mb-6">
              Our skilled technicians deliver top-notch service for all your devices, so you can trust us to keep your technology running smoothly.
            </p>

            <h3 className="text-xl font-bold text-[#A51B2B]">Contact Us</h3>
            <p className="text-gray-700 mb-6">
              Have questions? Reach out via phone or email—we’re here to assist you!
            </p>
            {/* Contact Us Button */}
            <a href="/contact" className="inline-block bg-[#F98C2D] text-white font-semibold py-2 px-4 rounded hover:bg-[#A51B2B]">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
  <h2 className="text-3xl font-bold text-[#A51B2B] mb-4 text-center">Our Services</h2>
  <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    
    {/* Computer Repair */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://img.freepik.com/free-photo/male-technician-examining-mother-board-with-digital-multimeter_23-2147922353.jpg" alt="Computer Repair" className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Computer Repair</h3>
      <p className="text-gray-700 mb-4">Expert repairs for desktops and laptops, ensuring your devices are back in working order quickly.</p>
    </div>

    {/* Printer Services */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://img.freepik.com/free-photo/woman-work-office-using-printer_23-2149456933.jpg?t=st=1730665599~exp=1730669199~hmac=dde222e4e74aa189c3c13844aa0228dc9eeeedb59f4c3d39cf26e749e5573cd9&w=900" alt="Printer Services" className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Printer Services</h3>
      <p className="text-gray-700 mb-4">Reliable repair and maintenance for all types of printers, including inkjet and laser models.</p>
    </div>

    {/* Monitor Repair */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://as2.ftcdn.net/v2/jpg/01/09/59/19/1000_F_109591951_a5JcZGGOYJXIjSNQXIYnsMUTG6FXOp4o.jpg" alt="Monitor Repair" className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Monitor Repair</h3>
      <p className="text-gray-700 mb-4">Specialized services for repairing and calibrating your computer monitors.</p>
    </div>

    {/* Data Recovery */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://img.freepik.com/free-photo/recovery-backup-restoration-data-storage-security-concept_53876-124770.jpg?t=st=1730665827~exp=1730669427~hmac=4b3a8d4a22806c386e5c6cc92920943b525bd7758554f59862e77369214bc97b&w=900" alt="Data Recovery" className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Data Recovery</h3>
      <p className="text-gray-700 mb-4">Professional data recovery services to restore lost or damaged files from your devices.</p>
    </div>

    {/* Network Setup */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://img.freepik.com/free-photo/electrical-panel-with-fuses-contactors-closeup_169016-52848.jpg?t=st=1730666147~exp=1730669747~hmac=288ffa66ee60e98d756d3e4fb529832c9e19ebc2ea28e386caeb3a702a18a1c2&w=900" alt="Network Setup" className="w-full h-48 object-cover rounded-t-lg mb-4" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Network Setup</h3>
      <p className="text-gray-700 mb-4">Setup and optimization of home and office networks for seamless connectivity.</p>
    </div>

    {/* Custom Builds */}
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
      <img src="https://img.freepik.com/free-photo/programmer-working-his-laptop_53876-101880.jpg?t=st=1730667215~exp=1730670815~hmac=1c51fd4db6e7bd479067ad1af660b0f9c968017391761cd249b4fda1311bb252&w=1060" />
      <h3 className="text-xl font-bold text-[#A51B2B] mb-2">Software Issues</h3>
      <p className="text-gray-700 mb-4">Build your custom computer to suit your specific needs, whether for gaming, design, or general use.</p>
    </div>

  </div>
</section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-100">
      <h2 className="text-4xl font-bold text-[#A51B2B] mb-8 text-center">Contact Us</h2>
      <form onSubmit={handleSubmit} className="bg-white max-w-lg mx-auto p-10 shadow-xl rounded-lg space-y-8">
        
        <div className="flex flex-col">
          <label htmlFor="name" className="text-[#04423D] font-semibold">Full Name</label>
          <input
            type="text"
            id="name"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            className="mt-2 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51B2B]"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="phone" className="text-[#04423D] font-semibold">Your Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51B2B]"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="text-[#04423D] font-semibold">Your Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 p-4 h-40 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A51B2B]"
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-[#A51B2B] text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </section>

        {/* Footer Section */}
        <footer class="bg-gray-800 text-white py-10">
    <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between">
            <div class="mb-6 md:mb-0 md:w-1/3">
                <h4 class="text-lg font-semibold mb-2">About Us</h4>
                <p class="text-sm leading-relaxed">We provide expert repair services for computers, laptops, printers, and more. Our mission is to deliver quality service and customer satisfaction.</p>
            </div>
            
            <div class="mb-6 md:mb-0 md:w-1/3 ml-[100px]">
                <h4 class="text-lg font-semibold mb-2]">Quick Links</h4>
                <ul class="space-y-1">
                    <li><a href="#" class="text-sm hover:underline">Home</a></li>
                    <li><a href="#" class="text-sm hover:underline">Services</a></li>
                    <li><a href="#" class="text-sm hover:underline">Contact</a></li>
                    <li><a href="#" class="text-sm hover:underline">Privacy Policy</a></li>
                </ul>
            </div>

            <div class="mb-6 md:mb-0 md:w-1/3">
                <h4 class="text-lg font-semibold mb-2">Contact Us</h4>
                <p class="text-sm">Email: <a href="mailto:info@future.com" class="text-blue-400 hover:underline">info@future.com</a></p>
                <p class="text-sm">Phone: <a href="tel:+1234567890" class="text-blue-400 hover:underline">+1 (234) 567-890</a></p>
            </div>
        </div>

        <div class="mt-8 text-center">
            <p class="text-sm">&copy; 2024 Future. All rights reserved.</p>
        </div>
    </div>
</footer>
    </div>
  );
};

export default Home;
