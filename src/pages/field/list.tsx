import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  complex } from "../../interfaces/Itable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { deleteField, fieldList, updateUniversalClock, updateFieldStatus } from "../../service/apis/field.api";
import toast from "react-hot-toast";
import { adminFieldsHeader } from "../../constants/tables";
import CommonTable from "../../components/tables/customTable/CommonTable";
import dataTable from "../../components/tables/DashboardTables.module.scss";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import del from "../../assets/images/ic_outline-delete.png";

import withRole from "../withRole";
import ModalForm from "../../components/UI/modal/ModalForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
const Fields = () => {
   const user = useSelector((state: RootState) => state.authSlice.user);
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
  const rowsPerPage = 10;

  // 🔹 Fetch data on mount & when currentPage/searchTerm changes
  // 🔹 Fetch data function

const handleToggleClock = async (id: string, value: boolean) => {
  try {
    const data = await updateUniversalClock({ unviseralClock: value }, id);
    fetchData();
  } catch {
    
  }
};
const fetchData = async (page = currentPage, term = searchTerm) => {
  try {
    setLoading(true);
    setAddClass("add_blur");

    const searchParams = term ? { search: term } : {};
    const response = await fieldList(page, rowsPerPage, searchParams);

    if (response) {
      setSortOrderData(response.fields);
      setTotalResult(response.total);
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

  const fieldStatusUpdate= async(id:any,status:any)=>{
    try {
      const response = await updateFieldStatus(id,{status});
      toast.success(response?.message);
        // refresh list after delete
      await fetchData(currentPage, searchTerm);
      
    } catch (error:any) {
      toast.error(error.message);
      console.error("Error deleting field:", error);
    }
  }

  return (
    <div style={{ position: "relative" }} className="dsp">
      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className="search-wrap">
          <div className="button-holder-wrap">
              <a className="custom-button" href='/field/add'>Add Field</a>
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
              columns={adminFieldsHeader(handleToggleClock,user?.role)}
              bodyData={sortOrderData}
              dataCurrentPage={currentPage}
              changePage={handlePageChange}
              totalData={totalResult}
              deleteMessage="Are you sure to delete this field?"
              handleDelete={handleDelete}
              renderActions={(row: any) => (
                <>
                  {(user && user.role==='admin' && (row.status==='pending' || !row.status))?
                    <p onClick={()=>fieldStatusUpdate(row._id,'approve')} className="edit">
                      <FontAwesomeIcon icon={faCheck} className="icon-themes" />
                    </p>
                   :null }
                   {(user && user.role==='admin' && row.status==='pending' || !row.status)?
                    <p onClick={()=>fieldStatusUpdate(row._id,'reject')} className="edit">
                      <FontAwesomeIcon icon={faClose} className="icon-themes" />
                    </p>
                    :null }
                 
                  <p>
                     <Link to={`/field/update/${row._id}`}>
                        <FontAwesomeIcon icon={faPencilAlt} className="icon-themes" />
                      </Link>
                  </p>
                  {row.status==='approve'?
                  <p onClick={() => { setQRShowModal(true); setSelectedData(row)}}><FontAwesomeIcon icon={faEye} className="icon-themes" /></p>
                  :null}
                  <p data-title="delete" data-id={row._id}><img src={del} alt='Delete' /></p>
                </>
              )}
            />
          )}
        </div>
      </div>
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
           window.open(selectedData.qrCodeUrl, "_blank");
        },
      },
      { label: "Close", type: "secondary", onClick: () => setQRShowModal(false) },
    ]}
    onClose={() => setQRShowModal(false)}
  />
)}
    </div>
     
  );
};

export default withRole(Fields, ["admin","event-director"]);