import React, { useEffect, useState } from "react";
import { Link ,useLocation} from "react-router-dom";
import { Itable, complex, ITeamsTable } from "../../../interfaces/Itable";
import noImage from "../../../assets/images/dummy.jpg";
import {Table,TableBody,TableCell,TableContainer,TableHead, TableRow,Paper,Button,Dialog,DialogActions,DialogContent,
        DialogContentText,DialogTitle,Stack,Pagination,} from "@mui/material";
import dataTable from "./datatable.module.scss";
import { teamsApi, deleteTeam,resetAuctionApi } from "../../../service/apis/team.api";

import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";
import bid from "../../../assets/images/bid.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

const TeamsTable: React.FC<Itable> = ({ bodyData, headData, totalData }) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.state?.fromPage || 1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>(bodyData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(totalData);
  const [loading, setLoading] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [resetModel, setResetModel] = useState(false);

  const rowsPerPage = 10;

  const handleClickOpen = (id: string) => {
    setSelectedTeamId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleResetAuctionClose = () => setResetModel(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchTerm(searchQuery);

    try {
      setLoading(true);
      setAddClass("add_blur");
      const bodyData = {
        currentPage: currentPage,
        limit: rowsPerPage,
        search: searchQuery,
      };
      setLoading(true);
      const response = await teamsApi(bodyData);
      if (response) {
        setLoading(false);
        setTotalResult(response?.totalResults);
        setSortOrderData(response?.Teams);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleSort = async (field: string) => {
    try {
      const bodyData = {
        currentPage: currentPage,
        limit: rowsPerPage,
        search: searchTerm,
      };
      const response = await teamsApi(bodyData);
      if (response) {
        setSortOrderData(response?.Teams);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
    }
  };

  const clearSearch = async () => {
    setSearchTerm("");
    try {
      setAddClass("add_blur");
      const bodyData = {
        limit: rowsPerPage,
        currentPage: 1,
        search: "",
      };
      setLoading(true);
      const response = await teamsApi(bodyData);
      if (response) {
        setSortOrderData(response?.Teams);
        setTotalResult(response?.totalResults);
        setLoading(false);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
    }
  };

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    setLoading(true);
    try {
      setAddClass("add_blur");
      const bodyData = {
        currentPage: page,
        limit: rowsPerPage,
        search: searchTerm,
      };
      const response = await teamsApi(bodyData);
      if (response) {
        setSortOrderData(response?.Teams);
        setLoading(false);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch page data", err);
    }
  };
  const ucwords = (str: string): string => {
    const exceptions = ["FirstName"];
    return str
      .split(" ")
      .map((word) => {
        if (exceptions.includes(word)) {
          return word;
        }
        return word.replace(/\b\w/g, (char: string) => char.toUpperCase());
      })
      .join(" ");
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTeam(selectedTeamId);
      if (response.status === 200) {
        toast.success(response.message);
        try {
          const bodyData = {
            currentPage: 1,
            limit: rowsPerPage,
          };
          const response = await teamsApi(bodyData);
          if (response) {
            setSortOrderData(response?.Teams);
            setTotalResult(response?.totalResults)
            // setLoading(false);
            // setAddClass("");
          }
        } catch (err) {
          console.error("Failed to fetch data", err);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
    setOpen(false);
  };

  const resetTeamAuction = async () => {
    setResetModel(false);
    setLoading(true);
    try {
      setAddClass("add_blur");
      const response = await resetAuctionApi();
      if (response.status === 200) {
        toast.success(response.message||"Auction has been reset successfully.");
        const bodyData = {
          currentPage: 1,
          limit: rowsPerPage,
        };
        const fetchResponse = await teamsApi(bodyData);
        if (fetchResponse) {
          setSortOrderData(fetchResponse?.Teams);
          setTotalResult(fetchResponse?.totalResults);
          // setLoading(false);
          setAddClass("");
        }
      } 
    } catch (error) {
      toast.error("An error occurred while resetting the auction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className='search-wrap'>
          <div className="button-holder-wrap">
            <Link to='/admin/teams/add'> <button className="custom-button" > Add Team </button> </Link>
            <button onClick={() => setResetModel(true)} className="custom-button" style={{marginLeft:15}}> Reset Auction </button>
          </div>
          <div
            className='searchwrap'
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "flex-start",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <input
              type='text'
              placeholder='Search...'
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
        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='simple table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  {headData.map((item, index) => (
                    <TableCell
                      align='left'
                      key={index}
                      onClick={() => handleSort(item)}
                    >
                      {ucwords(item)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {(sortOrderData as ITeamsTable[]).map((row: ITeamsTable) => {
                 // console.log(row);
                  return (
                    <TableRow
                      key={row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        <img
                          src={row?.teamLogo || noImage}
                          alt='Team Logo'
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        className={dataTable.productwrp}
                        component='th'
                        scope='row'
                      >
                        {row?.teamName}
                      </TableCell>
                      <TableCell align='left'>{row?.location}</TableCell>
                      <TableCell align='left'>{row?.status || "NA"}</TableCell>
                      <TableCell align='left'>
                        <div className={dataTable.actionwrap}>
                          <Link to={`/admin/teams/${row._id}`}state={{ fromPage: currentPage }}>
                            <p className={dataTable.edit}>
                              <FontAwesomeIcon
                                icon={faPen}
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              />
                            </p>
                          </Link>
                          <p
                            className={dataTable.delete}
                            onClick={() => handleClickOpen(row._id)}
                          >
                            <img src={del} alt='Delete' />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {sortOrderData.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Stack
          spacing={2}
          justifyContent='center'
          alignItems='center'
          style={{ marginTop: "30px" }}
        >
          <Pagination
            className='pagiWrap'
            count={Math.ceil(totalResult / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              ".MuiPaginationItem-page": {
                backgroundColor: "#fff",
                color: "#414141",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                "&.Mui-selected": {
                  backgroundColor: "#ff8400",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#ff8400",
                  color: "#fff",
                },
              },
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
            }}
          />
        </Stack>
      </div>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            overflowY: "inherit",
            padding: "40px",
            maxWidth: "562px",
          },
        }}
        maxWidth='md'
        fullWidth
        className={dataTable.custommodal}
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={dataTable.modalimg}>
          <img src={delt} alt='Delete Confirmation' />
        </div>
        <DialogTitle
          id='alert-dialog-title'
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {"Delete Team"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            style={{
              textAlign: "center",
              color: "#676767",
              fontSize: "16px",
            }}
          >
            {"Are you sure you want to delete this?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px" }}>
          <Button onClick={handleClose} className='btn-cancel'>
            {"Cancel"}
          </Button>
          <Button onClick={handleDelete} className='btn'>
            {"Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "35px",
          overflowY: "inherit",
          padding: "40px",
          maxWidth: "562px",
        },
      }}
      maxWidth="md"
      fullWidth
      open={resetModel}
      onClose={handleResetAuctionClose}
      className={dataTable.custommodal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div className={dataTable.modalimg}>
        <img src={bid} alt="Auction Reset Confirmation" />
      </div>
      <DialogTitle
        id="alert-dialog-title"
        style={{
          textAlign: "center",
          fontSize: "32px",
          color: "#000",
          fontWeight: "700",
        }}
      >
        {"Reset Auction"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{
            textAlign: "center",
            color: "#676767",
            fontSize: "16px",
          }}
        >
          {"Are you sure you want to reset the auction?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", gap: "15px" }}>
        <Button onClick={handleResetAuctionClose} className="btn-cancel">
          {"Cancel"}
        </Button>
        <Button
          onClick={async () => {
            await resetTeamAuction();
            handleResetAuctionClose();
          }}
          className="btn"
        >
          {"Reset"}
        </Button>
      </DialogActions>
    </Dialog>

    </div>
  );
};

export default TeamsTable;
