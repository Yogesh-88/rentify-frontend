import React, { useState } from "react";
import { InputBox } from "./InputBox";
import { Button } from "./Button";

export const FilterForm = ({ onChange }) => {
  const [bedrooms, setBedrooms] = useState("");

  const handleFilter = () => {
    onChange({ bedrooms });
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Filter Properties</h2>
      <InputBox
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
        label="Bedrooms"
      />
      <Button onClick={handleFilter} label="Apply Filters" />
    </div>
  );
};
