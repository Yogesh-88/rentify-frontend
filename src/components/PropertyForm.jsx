import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { InputBox } from "./InputBox";
import { Button } from "./Button";
const url = "http://localhost:3000";

export const PropertyForm = ({ onSuccess, isEdit = false, property = {} }) => {
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [amenities, setAmenities] = useState([""]);
  const { user } = useAuth();

  useEffect(() => {
    if (isEdit && property) {
      setLocation(property.location || "");
      setArea(property.area ? property.area.toString() : "");
      setBedrooms(property.bedrooms ? property.bedrooms.toString() : "");
      setBathrooms(property.bathrooms ? property.bathrooms.toString() : "");
      setAmenities(property.amenities || [""]);
    }
  }, [isEdit, property]);

  const handleAddOrUpdateProperty = async () => {
    if (
      !location ||
      !area ||
      !bedrooms ||
      !bathrooms ||
      amenities.some((amenity) => !amenity)
    ) {
      alert("All fields and amenities are required");
      return;
    }

    const parsedArea = parseFloat(area);
    if (isNaN(parsedArea)) {
      alert("Area must be a valid number");
      return;
    }

    const payload = {
      location,
      area: parsedArea,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities,
      userId: user?.userId,
    };

    try {
      if (isEdit) {
        await axios.put(`${url}/api/v1/properties/${property.id}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post(`${url}/api/v1/properties/`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setLocation("");
      setArea("");
      setBedrooms("");
      setBathrooms("");
      setAmenities([""]);
      onSuccess();
    } catch (error) {
      console.error(
        "Error adding/updating property:",
        error.response?.data || error.message
      );
      alert("Error adding/updating property");
    }
  };

  const handleAddAmenity = () => {
    setAmenities([...amenities, ""]);
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = amenities.slice();
    newAmenities[index] = value;
    setAmenities(newAmenities);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isEdit ? "Edit Property" : "Add Property"}
      </h2>
      <InputBox
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Property Location"
        label="Location"
        className="mb-4"
      />
      <InputBox
        value={area}
        onChange={(e) => setArea(e.target.value)}
        placeholder="Property Area"
        label="Area"
        type="number"
        step="any"
        className="mb-4"
      />
      <InputBox
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
        placeholder="Number of Bedrooms"
        label="Bedrooms"
        type="number"
        className="mb-4"
      />
      <InputBox
        value={bathrooms}
        onChange={(e) => setBathrooms(e.target.value)}
        placeholder="Number of Bathrooms"
        label="Bathrooms"
        type="number"
        className="mb-4"
      />
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Amenities
        </label>
        {amenities.map((amenity, index) => (
          <InputBox
            key={index}
            value={amenity}
            onChange={(e) => handleAmenityChange(index, e.target.value)}
            placeholder={`Amenity ${index + 1}`}
            label={`Amenity ${index + 1}`}
            className="mb-2"
          />
        ))}
        <Button
          onClick={handleAddAmenity}
          label="Add Amenity"
          className="w-full mt-2 mb-4"
        />
      </div>
      <Button
        onClick={handleAddOrUpdateProperty}
        label={isEdit ? "Update Property" : "Add Property"}
        className="w-full"
      />
    </div>
  );
};
