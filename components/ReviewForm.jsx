import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => setSubmissions(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setSubmissions(prevSubmissions => [formData, ...prevSubmissions]);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to submit review:', errorData.error);
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white font-bold text-xl">
            LOGO
          </div>
          <h1 className="text-3xl font-bold text-blue-800">EduBridge Review Portal</h1>
        </div>
        <div className="flex items-center">
          <Phone className="text-blue-500 mr-2" />
          <span className="text-lg font-semibold">1-800-EDU-HELP</span>
        </div>
      </header>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Share Your EduBridge Experience</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number (Optional)"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your experience with EduBridge..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Submit Review
          </button>
        </form>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Recent Reviews</h2>
        {submissions.length > 0 ? (
          submissions.map((submission, index) => (
            <div key={index} className="bg-gray-50 p-4 mb-4 rounded border border-gray-200">
              <p className="font-semibold text-lg">{submission.firstName} {submission.lastName}</p>
              <p className="text-gray-600 mb-2">{submission.email}</p>
              <p className="text-gray-800">{submission.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews submitted yet. Be the first to share your experience!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;