import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { complex } from "../../interfaces/Itable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import {  deleteGame, gameList } from "../../service/apis/game.api";
import toast from "react-hot-toast";
import { getAdminGamesHeader } from "../../constants/tables";
import CommonTable from "../../components/tables/customTable/CommonTable";
import dataTable from "../../components/tables/DashboardTables.module.scss";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import del from "../../assets/images/ic_outline-delete.png";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { environment } from "../../config/environment";
import { getScoreKeeperCode } from "../../service/apis/scoreKeeper.api";
const Games = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [currentPage, setCurrentPage] = useState(location.state?.fromPage || 1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const rowsPerPage = 10;
  const adminGamesHeader = getAdminGamesHeader(user?.role);

  // inside your component
  const handleOpenScoreKeeper = async (gameId: string) => {
    try {
      setLoading(true);
      setAddClass("add_blur");
      const data = await getScoreKeeperCode(gameId);
      const url = `${environment.forntend_url}/score-keeper?code=${data.code}`;
      setLoading(false);
      setAddClass("");
      window.open(url, "_blank");
    } catch (err: any) {
      setLoading(false);
      setAddClass("");
      console.error("Error opening ScoreKeeper:", err);
    }
  };

  // 🔹 Fetch data on mount & when currentPage/searchTerm changes
  // 🔹 Fetch data function
const fetchData = async (page = currentPage, term = searchTerm) => {
  try {
    setLoading(true);
    setAddClass("add_blur");

    const searchParams = term ? { search: term } : {};
    const response = await gameList(page, rowsPerPage, searchParams);

    if (response) {
      setSortOrderData(response.games);
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

  // 🔹 Pagination
  const handlePageChange = async (
    page: number
  ) => {
    setCurrentPage(page);
  };

  // 🔹 Delete field
  const handleDelete = async (selectedFieldId: any) => {
    try {
      const response = await deleteGame(selectedFieldId);
     
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
            {(user?.role==='admin')?
            <Link to="/games/add"><button className="custom-button">Add Game</button></Link>
            :""}
              
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
              columns={adminGamesHeader}
              bodyData={sortOrderData}
              dataCurrentPage={currentPage}
              changePage={handlePageChange}
              totalData={totalResult}
              deleteMessage="Are you sure to delete this field?"
              handleDelete={handleDelete}
              renderActions={(row: any) => {
                if (user?.role === "admin") {
                  return (
                    <>
                      <p>
                        <Link to={`/games/update/${row._id}`}>
                          <FontAwesomeIcon icon={faPencilAlt} className="icon-themes" />
                        </Link>
                      </p>
                      <p>
                        <span data-title="delete" data-id={row._id}>
                          <img src={del} alt="Delete" />
                        </span>
                      </p>
                    </>
                  );
                } else {
                  // 👇 non-admin (scorekeeper view)
                  return (
                    <p>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // prevent default navigation
                            handleOpenScoreKeeper(row._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} className="icon-themes" />
                        </a>
                    </p>
                  );
                }
              }}
            />
          )}
        </div>
      </div>
   
    </div>
     
  );
};

export default Games;