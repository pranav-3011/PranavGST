import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Box, Tag, Hash, Database } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";

const SummonsDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [summonsList, setSummonsList] = useState([]);
  const [selectedSummons, setSelectedSummons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date_of_summons: "",
    din_on_authorization: "",
    description_of_goods: "",
    si_unit: "",
    quantity: 0,
    model_mark: "",
  });

  useEffect(() => {
    if (fileNumber) {
      fetchSummonsList();
    }
  }, [fileNumber]);

  const fetchSummonsList = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/summons/investigation/${fileNumber}/`
      );
      setSummonsList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching summons list:", error);
      setError(error.message || "Failed to fetch summons list");
      setIsLoading(false);
    }
  };

  const handleAddSummons = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/summons/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      setFormData({
        date_of_summons: "",
        din_on_authorization: "",
        description_of_goods: "",
        si_unit: "",
        quantity: 0,
        model_mark: "",
      });
      fetchSummonsList();
    } catch (error) {
      console.error("Error adding summons:", error);
      setError(error.message || "Failed to add summons");
    }
  };

  const handleViewSummons = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/summons/${id}/`);
      setSelectedSummons(data);
    } catch (error) {
      console.error("Error fetching summons details:", error);
      setError(error.message || "Failed to fetch summons details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!fileNumber) {
    return (
      <div className="p-4">
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          No investigation selected
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (selectedSummons) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => setSelectedSummons(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Summons Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Summons</p>
                  <p className="font-medium">
                    {selectedSummons.date_of_summons
                      ? new Date(selectedSummons.date_of_summons).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedSummons.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Description of Goods</p>
                  <p className="font-medium">{selectedSummons.description_of_goods || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SI Unit</p>
                  <p className="font-medium">{selectedSummons.si_unit || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Database className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{selectedSummons.quantity || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Model Mark</p>
                  <p className="font-medium">{selectedSummons.model_mark || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedSummons.added_on
                      ? new Date(selectedSummons.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(false)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" />
              Add New Summons
            </h2>
          </div>
          <form onSubmit={handleAddSummons} className="p-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="date_of_summons" className="block text-sm font-medium text-gray-700">
                    Date of Summons <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date_of_summons"
                    name="date_of_summons"
                    type="date"
                    value={formData.date_of_summons}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="din_on_authorization" className="block text-sm font-medium text-gray-700">
                    DIN on Authorization <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="din_on_authorization"
                    name="din_on_authorization"
                    type="text"
                    value={formData.din_on_authorization}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter DIN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description_of_goods" className="block text-sm font-medium text-gray-700">
                  Description of Goods <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description_of_goods"
                  name="description_of_goods"
                  value={formData.description_of_goods}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter description of goods"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="si_unit" className="block text-sm font-medium text-gray-700">
                    SI Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="si_unit"
                    name="si_unit"
                    type="text"
                    value={formData.si_unit}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. kg, liter, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="model_mark" className="block text-sm font-medium text-gray-700">
                    Model Mark <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="model_mark"
                    name="model_mark"
                    type="text"
                    value={formData.model_mark}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter model/mark"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Summons
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Summons</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Summons
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summonsList.map((summons) => (
          <div
            key={summons.id}
            onClick={() => handleViewSummons(summons.id)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Summons #{summons.id}</p>
                <p className="font-medium">
                  {summons.date_of_summons
                    ? new Date(summons.date_of_summons).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Box size={16} />
                <span className="truncate">{summons.description_of_goods || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Database size={16} />
                <span>
                  {summons.quantity} {summons.si_unit || "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag size={16} />
                <span>{summons.model_mark || "-"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {summonsList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No summons found</p>
        </div>
      )}
    </div>
  );
};

export default SummonsDetails;
