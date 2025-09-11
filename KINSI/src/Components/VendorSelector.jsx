// src/components/VendorSelector.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const VendorSelector = ({ apiCall, onVendorsSelected }) => {
  const [availableVendors, setAvailableVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [showVendorSelect, setShowVendorSelect] = useState(false);

  // Fetch vendors by type
  const fetchVendorsByType = async (type) => {
    try {
      const response = await apiCall(`/vendors?type=${encodeURIComponent(type)}`);
      setAvailableVendors(response.vendors || []);
      setShowVendorSelect(true);
    } catch (error) {
      console.error(`Failed to fetch vendors for ${type}:`, error);
    }
  };

  const toggleVendor = (vendor) => {
    if (selectedVendors.some((v) => v.id === vendor.id)) {
      setSelectedVendors(selectedVendors.filter((v) => v.id !== vendor.id));
    } else {
      setSelectedVendors([...selectedVendors, vendor]);
    }
  };

  const handleSaveSelection = () => {
    onVendorsSelected(selectedVendors); // Pass vendors back to parent
    setShowVendorSelect(false);
  };

  return (
    <div>
      {/* Vendor Type Buttons */}
      <div className="grid md:grid-cols-3 gap-2 mb-4">
        {[
          "Photography",
          "Catering",
          "Decoration",
          "Venue",
          "Music & Entertainment",
          "Event Planning",
          "Flowers",
          "Transportation",
        ].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => fetchVendorsByType(type)}
            className="p-2 rounded-xl bg-orange-100 text-orange-800 font-semibold hover:bg-orange-200"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Vendor Selection Modal */}
      {showVendorSelect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Vendors</h2>
              <button onClick={() => setShowVendorSelect(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {availableVendors.length === 0 ? (
              <p>No vendors available for this category</p>
            ) : (
              <div className="space-y-3">
                {availableVendors.map((vendor) => (
                  <label key={vendor.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedVendors.some((v) => v.id === vendor.id)}
                      onChange={() => toggleVendor(vendor)}
                    />
                    <span>{vendor.business_name}</span>
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleSaveSelection}
              className="mt-4 w-full bg-orange-600 text-white py-2 rounded-xl font-bold hover:bg-orange-700"
            >
              Save Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSelector;
