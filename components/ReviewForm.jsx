import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      console.log(result.message);
      await fetchReviews(); // Refresh the reviews list
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {/* ... (rest of the component remains the same) ... */}
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (form fields remain the same) ... */}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Recent Reviews</h2>
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : submissions.length > 0 ? (
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
