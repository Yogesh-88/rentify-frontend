import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const url = "http://localhost:3000";

const PropertyDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const response = await axios.get(`${url}/api/v1/properties/${id}`);
      setProperty(response.data);
    };
    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{property.title}</h1>
      <p>{property.description}</p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Likes: {property.likes}</p>
      {isAuthenticated && (
        <button className="btn btn-primary">Interested</button>
      )}
    </div>
  );
};

export default PropertyDetails;
