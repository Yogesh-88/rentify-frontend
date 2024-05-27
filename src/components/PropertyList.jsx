import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PropertyForm } from "./PropertyForm";
import { Modal } from "./Modal";
const url = "http://localhost:3000";

export const PropertyList = ({
  properties,
  isSeller,
  onRefresh,
  onInterest,
}) => {
  const { user } = useAuth();
  const [editingProperty, setEditingProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedProperties, setLikedProperties] = useState([]);

  useEffect(() => {
    const liked =
      JSON.parse(localStorage.getItem(`likedProperties_${user.id}`)) || [];
    setLikedProperties(liked);
  }, [user.id]);

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`${url}/api/v1/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onRefresh();
    } catch (error) {
      console.error(
        "Error deleting property:",
        error.response?.data || error.message
      );
      alert("Error deleting property");
    }
  };

  const handleEdit = async (propertyId) => {
    try {
      const response = await axios.get(
        `${url}/api/v1/properties/${propertyId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEditingProperty(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(
        "Error fetching property:",
        error.response?.data || error.message
      );
      alert("Error fetching property details");
    }
  };

  const handleLike = async (propertyId) => {
    if (likedProperties.includes(propertyId)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${url}/api/v1/properties/${propertyId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Like response:", response.data);

      const updatedLikedProperties = [...likedProperties, propertyId];
      setLikedProperties(updatedLikedProperties);
      localStorage.setItem(
        `likedProperties_${user.id}`,
        JSON.stringify(updatedLikedProperties)
      );

      onRefresh();
    } catch (error) {
      console.error(
        "Error liking property:",
        error.response?.data || error.message
      );
      alert("Error liking property");
    }
  };

  const handleFormSuccess = () => {
    setEditingProperty(null);
    setIsModalOpen(false);
    onRefresh();
  };

  return (
    <div className="container mx-auto py-8">
      {isSeller ? (
        <h1 className="text-3xl font-semibold text-center mb-8">
          My Properties
        </h1>
      ) : (
        <h1 className="text-3xl font-semibold text-center mb-8">Properties</h1>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{property.location}</h3>
            <p className="text-gray-700 mb-1">Area: {property.area} sqm</p>
            <p className="text-gray-700 mb-1">Bedrooms: {property.bedrooms}</p>
            <p className="text-gray-700 mb-1">
              Bathrooms: {property.bathrooms}
            </p>
            <p className="text-gray-700 mb-1">
              Amenities: {property.amenities.join(", ")}
            </p>
            <p className="text-gray-700 mb-4">Likes: {property.likes}</p>
            <div className="flex justify-between items-center">
              {isSeller ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(property.id)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onInterest(property.id)}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Interested
                  </button>
                  <button
                    onClick={() => handleLike(property.id)}
                    className={`${
                      likedProperties.includes(property.id)
                        ? "bg-gray-500"
                        : "bg-yellow-500"
                    } text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                    disabled={likedProperties.includes(property.id)}
                  >
                    {likedProperties.includes(property.id) ? "Liked" : "Like"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editingProperty && (
          <PropertyForm
            onSuccess={handleFormSuccess}
            isEdit={true}
            property={editingProperty}
          />
        )}
      </Modal>
    </div>
  );
};
