import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PropertyForm } from "../components/PropertyForm";
import { PropertyList } from "../components/PropertyList";
import { FilterForm } from "../components/FilterForm";
const url = "http://localhost:3000";
const SellerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    const response = await axios.get(`${url}/api/v1/properties/seller`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setProperties(response.data);
    setFilteredProperties(response.data);
  };

  const handleFilterChange = (filters) => {
    const { bedrooms } = filters;
    const filtered = properties.filter((property) =>
      bedrooms ? property.bedrooms === parseInt(bedrooms) : true
    );
    setFilteredProperties(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <FilterForm onChange={handleFilterChange} />
      <PropertyForm onSuccess={fetchProperties} />
      <PropertyList
        properties={filteredProperties}
        isSeller={true}
        onRefresh={fetchProperties}
      />
    </div>
  );
};

export default SellerDashboard;
