import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const url = "http://localhost:3000";

const SellerProperties = () => {
  const [properties, setProperties] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await axios.get(`${url}/api/v1/properties/seller`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProperties(response.data);
    };
    fetchProperties();
  }, [user]);

  return (
    <div>
      <h1>My Properties</h1>
      {properties.map((property) => (
        <div key={property.id}>
          <h2>{property.name}</h2>
        </div>
      ))}
    </div>
  );
};

export default SellerProperties;
