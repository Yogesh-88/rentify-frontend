import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PropertyList } from "../components/PropertyList";
import { FilterForm } from "../components/FilterForm";
const url = "http://localhost:3000";

const BuyerDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    const response = await axios.get(`${url}/api/v1/properties`, {
      params: filters,
    });
    setProperties(response.data);
  };

  const handleInterest = async (propertyId) => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${url}/api/v1/properties/${propertyId}/interested`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Seller details sent to your email.");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Properties</h1>
      <FilterForm onChange={setFilters} />
      <PropertyList
        properties={properties}
        onInterest={handleInterest}
        onRefresh={fetchProperties}
      />
    </div>
  );
};

export default BuyerDashboard;
