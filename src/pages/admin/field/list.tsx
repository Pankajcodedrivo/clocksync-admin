import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Itable, complex } from "../../../interfaces/Itable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { addField, deleteField, fieldList, updateField } from "../../../service/apis/field.api";
import toast from "react-hot-toast";
import { adminFieldsHeader } from "../../../constants/tables";
import CommonTable from "../../../components/tables/customTable/CommonTable";
import dataTable from "../../../components/tables/DashboardTables.module.scss";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";
import ModalForm from "../../../components/UI/modal/ModalForm";
import * as Yup from "yup";
const Fields: React.FC<Itable> = () => {
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setQRShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.state?.fromPage || 1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const rowsPerPage = 10;

  // 🔹 Fetch data on mount & when currentPage/searchTerm changes
  // 🔹 Fetch data function
const fetchData = async (page = currentPage, term = searchTerm) => {
  try {
    setLoading(true);
    setAddClass("add_blur");

    const searchParams = term ? { search: term } : {};
    const response = await fieldList(page, rowsPerPage, searchParams);

    if (response) {
      setSortOrderData(response.fields);
      setTotalResult(response.totalResults);
    }
  } catch (err:any) {
    toast.error(err.message);
    console.error("Failed to fetch data", err);
  } finally {
    setLoading(false);
    setAddClass("");
  }
};

// 🔹 Use in useEffect
useEffect(() => {
  fetchData(currentPage, searchTerm);
}, [currentPage, searchTerm]);

  // 🔹 Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

  // 🔹 Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // 🔹 Add Field
  const  addFieldFrom= async(data:any) => {
    try {
      setLoading(true);
      setShowModal(false);
      setAddClass("add_blur");
      await addField(data);
      setLoading(false);
      fetchData(1);
      toast.success("Field add successfully");
    } catch (err:any) {
      toast.error(err.message);
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
      setAddClass("");
    }
};
  const  updateFormData = async(data:any) => {
          try {
            setLoading(true);
            setShowEditModal(false);
            await updateField(data,editData._id); // call your update API
            fetchData(currentPage, searchTerm);      // refresh table
            toast.success("Field updated successfully");
          } catch (err: any) {
            toast.error(err.message);
            console.error("Failed to update field", err);
          } finally {
            setLoading(false);
          }
        }
  // 🔹 Pagination
  const handlePageChange = async (
    page: number
  ) => {
    setCurrentPage(page);
  };

  // 🔹 Delete field
  const handleDelete = async (selectedFieldId: any) => {
    try {
      const response = await deleteField(selectedFieldId);
     
        toast.success(response.message);
        // refresh list after delete
        await fetchData(currentPage, searchTerm);
      
    } catch (error:any) {
      toast.error(error.message);
      console.error("Error deleting field:", error);
    }
  };

  return (
    <div style={{ position: "relative" }} className="dsp">
      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className="search-wrap">
          <div className="button-holder-wrap">
              <button className="custom-button" onClick={() => setShowModal(true)}>Add Field</button>
          </div>

          {/* Search bar */}
          <div
            className="searchwrap"
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "flex-start",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                maxWidth: "350px",
                height: "50px",
                width: "100%",
                marginLeft: "auto",
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#999",
                }}
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="usertabledata">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <CommonTable
              title="Fields"
              columns={adminFieldsHeader}
              bodyData={sortOrderData}
              dataCurrentPage={currentPage}
              changePage={handlePageChange}
              totalData={totalResult}
              deleteMessage="Are you sure to delete this field?"
              handleDelete={deleteField}
              renderActions={(row: any) => (
                <>
                  <button
                    onClick={() => {
                      setEditData(row);       // set data to prefill form
                      setShowEditModal(true); // open modal
                    }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button onClick={() => { setQRShowModal(true); setSelectedData(row)}}>view</button>
                  <button onClick={() => handleDelete(row?._id)}>Delete</button>
                </>
              )}
            />
          )}
        </div>
      </div>
       {showModal ? (
        <ModalForm
  title="Add New Field"
  fields={[
    {
      name: "name",
      label: "Field Name",
      type: "text",
      placeholder: "Enter field name",
      validation: Yup.string().required("Field name is required"),
    },
  ]}
  actions={[
    { label: "cancel", type: "secondary", onClick: () =>setShowModal(false) },
    { label: "save", type: "primary", submit: true, onClick: (values) => addFieldFrom(values) },
  ]}
  onClose={() => setShowModal(false)}
/>

      ) : null}

      {showQRModal  && selectedData && (
  <ModalForm
    title="Scan this QR Code"
    message={
      <div style={{ textAlign: "center" }}>
        <p>Scan to connect your account: <b>{selectedData.name}</b></p>
        <img
          src={selectedData.qrCodeUrl} // or use qrcode.react for dynamic
          alt="QR Code"
          style={{     width: "200px",
    margin: "10px auto",
    display: "block" }}
        />
      </div>
    }
    actions={[
      {
        label: "Download",
        type: "primary",
        onClick: () => {
          const link = document.createElement("a");
            link.href = selectedData.qrCodeUrl; // fixed
          link.download = `qr-${selectedData._id}.png`;
          link.click();
        },
      },
      { label: "Close", type: "secondary", onClick: () => setQRShowModal(false) },
    ]}
    onClose={() => setQRShowModal(false)}
  />
)}
{showEditModal && editData && (
  <ModalForm
    title="Edit Field"
    fields={[
      {
        name: "name",
        label: "Field Name",
        type: "text",
        placeholder: "Enter field name",
        defaultValue: editData.name, // prefill existing value
        validation: Yup.string().required("Field name is required"),
      },
      // add other fields here if needed
    ]}
    actions={[
      { label: "Cancel", type: "secondary", onClick: () => setShowEditModal(false) },
      { 
        label: "Save", 
        type: "primary", 
        submit: true, 
        onClick: async (values) => updateFormData(values) 
      },
    ]}
    onClose={() => setShowEditModal(false)}
  />
)}
    </div>
     
  );
};

export default Fields;