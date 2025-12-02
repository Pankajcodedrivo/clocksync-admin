import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { complex } from "../../interfaces/Itable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye, faPencilAlt, faUpload } from "@fortawesome/free-solid-svg-icons";
import {  deleteGame, downloadGameStatistics, gameList, importGame } from "../../service/apis/game.api";
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
import ModalForm from "../../components/UI/modal/ModalForm";
import { images } from "../../constants";
import { getUpcomingEvent } from "../../service/apis/event.api";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const Games = () => {
  const sampleFile = "/sample_games.xlsx";
  const sampleFileName = "sample_games.xlsx";
  const location = useLocation();
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [currentPage, setCurrentPage] = useState(location.state?.fromPage || 1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>([]);
  const [eventData, setEventData] = useState<complex[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(0);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const rowsPerPage = 10;
  const adminGamesHeader = getAdminGamesHeader(user?.role);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewType, setPreviewType] = useState("document"); // 'document' | 'excel' | 'csv'
  const [fileName, setFileName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  // inside your component
  const handleOpenScoreKeeper = async (gameId: string) => {
  // 1️⃣ Open a blank window immediately (Safari requires this!)
  const newWindow = window.open("", "_blank");
  if (!newWindow) {
    alert("Please enable pop-ups for this website.");
    return;
  }

  try {
    setLoading(true);
    setAddClass("add_blur");

    // 2️⃣ Await your API call
    const data = await getScoreKeeperCode(gameId);

    // 3️⃣ Update the new window's location
    const url = `${environment.forntend_url}/score-keeper?code=${data.code}`;
    newWindow.location.href = url;
  } catch (err: any) {
    toast.error("Error opening ScoreKeeper:", err);

    // Close the blank window if something failed
    newWindow.close();
  } finally {
    setLoading(false);
    setAddClass("");
  }
};

const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type! Please upload an Excel or CSV file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5 MB limit!");
      return;
    }

    // 🔍 Detect file type for icon
    const ext = file.name.split(".").pop().toLowerCase();
    if (["xlsx", "xls"].includes(ext)) {
      setPreviewType("excel");
    } else if (ext === "csv") {
      setPreviewType("csv");
    } else {
      setPreviewType("document");
    }

    setUploadFile(file);
    setFileName(file.name);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file first!");
      return;
    }
    setImportLoading(true);
    const formData = new FormData();
    // Get the user's current timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    formData.append("file", uploadFile);
    formData.append("eventId", selectedEvent);
    formData.append("timeZone", userTimeZone);
    try {
      const response = await importGame(formData);
      if (!response.success) throw new Error("Upload failed");
      toast.success("File uploaded successfully!");
      setShowUploadModal(false);
      setUploadFile(null);
      setPreviewType("document");
      setFileName("");
      fetchData();
      setImportLoading(false);
    } catch (err) {
      setImportLoading(false);
      console.error(err);
      toast.error("Error uploading file");
    }
  };

  // 🔹 Fetch data on mount & when currentPage/searchTerm changes
  // 🔹 Fetch data function
const fetchData = async (page = currentPage, term = searchTerm, eventId = selectedEvent) => {
  try {
    setLoading(true);
    setAddClass("add_blur");
    const searchParams: any = {};
    if (term) searchParams.search = term;
    if (user?.role === "event-director" && eventId) searchParams.eventId = eventId; // filter by event only for admin

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

const fetchEvent = async () => {
  try {
    const response = await getUpcomingEvent();

    if (response) {
      setEventData(response.events);
      if(response.events.length>0 && response?.events[0]?._id) setSelectedEvent(response?.events[0]?._id)
    }
  } catch (err:any) {
    toast.error(err.message);
    console.error("Failed to fetch data", err);
  } finally {
  }
};
const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const eventId = e.target.value;
  setSelectedEvent(eventId);
  setCurrentPage(1);
  fetchData(1, searchTerm, eventId); // reload list with selected event
};
 
// 🔹 Use in useEffect
useEffect(() => {
  fetchData(currentPage, searchTerm);
  if (user?.role === "event-director") fetchEvent();
 
}, [currentPage, searchTerm, selectedEvent]);

  // 🔹 Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

  const isGameActive = (game: any) => {
    const now = new Date(); // local browser time
    const start = new Date(game.startDateTime); // UTC → local
    const end = new Date(game.endDateTime);     // UTC → local

    return start.getTime() <= now.getTime() &&
          game.endGame === false;
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
      {user?.role === "event-director" && (
      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className="search-wrap">
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
            <select
              value={selectedEvent}
              onChange={handleEventChange}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                maxWidth: "350px",
                height: "50px",
                width: "100%",
                marginLeft: "auto",
              }}
            >
              <option value="">Please select the event</option>
              {eventData.map((event: any) => (
                <option key={event._id} value={event._id}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
       )}
      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className="search-wrap">
          <div className="button-holder-wrap">
            {(user?.role!=='scorekeeper')?
            <>
            <Link to="/games/add"  state={{ eventId: selectedEvent }} ><button className="custom-button">Add Game</button></Link>
            <button className="custom-button ml-1" onClick={() => setShowUploadModal(true)}>Upload File</button>
            </>
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
              title="Game"
              columns={adminGamesHeader}
              bodyData={sortOrderData}
              dataCurrentPage={currentPage}
              changePage={handlePageChange}
              totalData={totalResult}
              deleteMessage="Are you sure to delete this game?"
              handleDelete={handleDelete}
              renderActions={(row: any) => {
                  // 🔹 SCOREKEEPER VIEW
                if (user?.role === "scorekeeper") {
                  return (
                    <p>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const active = isGameActive(row);

                          if (!active) {
                            if (!row.endGame) {
                              toast.error(
                                `This game will start on ${new Date(row.startDateTime).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })} at ${new Date(row.startDateTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              );
                            } else {
                              toast.error("This game has ended.");
                            }
                            return;
                          }

                          handleOpenScoreKeeper(row._id);
                        }}
                        className="action-anch"
                      >
                        <FontAwesomeIcon icon={faEye} className="icon-themes" />
                      </a>
                    </p>
                  );
                }

                // 🔹 ADMIN + EVENT DIRECTOR VIEW
                return (
                  <>
                    {/* Edit */}
                    <p>
                      <Link to={`/games/update/${row._id}`}>
                        <FontAwesomeIcon icon={faPencilAlt} className="icon-themes" />
                      </Link>
                    </p>

                    {/* Delete */}
                    <p data-title="delete" data-id={row._id}>
                      <span>
                        <img src={del} alt="Delete" />
                      </span>
                    </p>

                    {/* Excel Download (Admins only) */}
                    {user?.role === "admin" && (
                      <p>
                        <a
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              const file = await downloadGameStatistics(row._id);

                              const blob = new Blob([file], {
                                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                              });

                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `game_statistics_${row._id}.xlsx`;
                              link.click();
                              window.URL.revokeObjectURL(url);
                            } catch (error) {
                              toast.error("Failed to download Excel file");
                            }
                          }}
                          className="action-anch"
                        >
                          <FontAwesomeIcon icon={faDownload} className="icon-themes" />
                        </a>
                      </p>
                    )}
                  </>
                );
              }}

            />
          )}
        </div>
      </div>
      {showUploadModal && (
        <ModalForm
          title="Upload File"
          message={
            <>
              {importLoading?
              <LoadingSpinner /> :null}
              <div style={{ textAlign: "center" }} className="settings">
                 
                <div className="upload-logo-file">
                <div className="uploadimage">
                  <div className="upload-logo">
                    <img
                        src={
                          previewType === 'excel'
                            ? images.xlsxfile
                            : previewType === 'csv'
                            ? images.csvfile
                            : images.documentIcon
                        }
                        alt="upload preview"
                      />
                      {fileName?fileName:"Upload xlsx or csv file"}
                      
                    <input
                      type="file"
                      accept=".xlsx, .csv" 
                      onChange={handleFileChange}
                    />
                    <div className="overlay">
                      <span className="icon">
                        <FontAwesomeIcon icon={faUpload} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </>
          }
          actions={[
            { 
              label: "Download sample file", 
              type: "primary", 
              onClick:() => {
                const link = document.createElement("a");
                link.href = sampleFile; // your file path
                link.download = sampleFileName; // optional: specify filename
                link.click();
              }
            },
            { label: "Cancel", type: "secondary", onClick: () => setShowUploadModal(false) },
            { 
              label: "Upload", 
              type: "primary", 
              onClick: handleUpload
            },
          ]}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
     
  );
};

export default Games;