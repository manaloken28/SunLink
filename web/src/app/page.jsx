import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
  });
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: "",
  });
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState({
    requests: false,
    submitRequest: false,
    submitFeedback: false,
  });

  // Fetch service requests from API
  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    setLoading((prev) => ({ ...prev, requests: true }));
    try {
      const response = await fetch("/api/service-requests");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setServiceRequests(data.data);
      } else {
        console.error("Failed to fetch service requests:", data.error);
      }
    } catch (error) {
      console.error("Error fetching service requests:", error);
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "In Progress":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submitRequest: true }));

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert("Service request submitted successfully!");
        setFormData({ name: "", email: "", details: "" });
        // Refresh the service requests list
        fetchServiceRequests();
      } else {
        throw new Error(data.error || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submitRequest: false }));
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submitFeedback: true }));

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment: feedbackData.comment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert("Feedback submitted successfully!");
        setFeedbackData({ rating: 0, comment: "" });
        setRating(0);
      } else {
        throw new Error(data.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, submitFeedback: false }));
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                SunLink
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="#home"
                className="font-medium text-sm text-orange-500 hover:text-orange-600 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => scrollToSection("services")}
                className="font-medium text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
              >
                Services
              </a>
              <a
                href="#updates"
                onClick={() => scrollToSection("updates")}
                className="font-medium text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
              >
                Updates
              </a>
              <a
                href="#feedback"
                onClick={() => scrollToSection("feedback")}
                className="font-medium text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
              >
                Feedback
              </a>
              <a
                href="/login"
                className="font-medium text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                Login
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#home"
                className="block px-3 py-2 text-orange-500 font-medium rounded-md"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={() => {
                  scrollToSection("services");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                Services
              </a>
              <a
                href="#updates"
                onClick={() => {
                  scrollToSection("updates");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                Updates
              </a>
              <a
                href="#feedback"
                onClick={() => {
                  scrollToSection("feedback");
                  setMobileMenuOpen(false);
                }}
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md cursor-pointer"
              >
                Feedback
              </a>
              <a
                href="/login"
                className="block px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md"
              >
                Login
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-16 pb-12 bg-gradient-to-b from-orange-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Orbital Mirrors.
              <span className="block text-orange-500">
                Infinite Light. Endless Possibilities
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with Davao City services seamlessly. Submit requests,
              track progress, and provide feedback all in one place.
            </p>
            <button
              onClick={() => scrollToSection("services")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Service Request Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Submit a Service Request
            </h2>
            <p className="text-lg text-gray-600">
              Let us know how we can help improve your community
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Request Details
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Describe your service request in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading.submitRequest}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                {loading.submitRequest ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Updates Section */}
      <section id="updates" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Updates
            </h2>
            <p className="text-lg text-gray-600">
              Track the progress of community service requests
            </p>
          </div>

          {loading.requests ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading service requests...</p>
            </div>
          ) : serviceRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No service requests found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {request.details.substring(0, 50)}...
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {request.location || "Location not specified"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${request.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {request.progress}% Complete
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Share Your Feedback
            </h2>
            <p className="text-lg text-gray-600">
              Help us improve our services for the community
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Rate our service
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-colors duration-200"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Comments
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={feedbackData.comment}
                  onChange={(e) =>
                    setFeedbackData({
                      ...feedbackData,
                      comment: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="Share your thoughts and suggestions..."
                />
              </div>

              <button
                type="submit"
                disabled={loading.submitFeedback}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                {loading.submitFeedback ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="ml-3 text-xl font-bold">SunLink</span>
              </div>
              <p className="text-gray-400">
                Connecting Davao City communities with efficient digital
                services.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="text-gray-400">(082) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="text-gray-400">
                    contact@sunlink.davao.gov.ph
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="text-gray-400">Davao City, Philippines</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 SunLink Davao City. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
