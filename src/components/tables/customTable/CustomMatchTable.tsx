import React, { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { Itable, complex, IMatchTable } from "../../../interfaces/Itable";
import { useTranslation } from "react-i18next";
// import noImage from "../../../assets/images/dummy.jpg";

import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button,Dialog,DialogActions,
        DialogContent,DialogContentText,DialogTitle,Pagination,Stack} from "@mui/material";

import dataTable from "./datatable.module.scss";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";
import { matchApi, deleteMatch } from "../../../service/apis/matches.api";

import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../../UI/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

const CustomTable: React.FC<Itable> = ({ bodyData, headData, totalData }) => {
  const location = useLocation();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(location.state?.fromPage || 1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>(bodyData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(totalData);
  const [loading, setLoading] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const [selectedMatachId, setSelectedMatchId] = useState<string | null>(null);

  const rowsPerPage = 10;

  const handleClickOpen = (matchID: string) => {
    setSelectedMatchId(matchID);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
      const response = await matchApi(bodyData);
      if (response?.status === 200) {
        setLoading(false);
        setTotalResult(response?.listMatch?.totalResults);
        setSortOrderData(response?.listMatch?.Matches);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };
  const refreshmatch = async (page = currentPage) => {
    try {
      const bodyData = { currentPage: page, limit: rowsPerPage,search: searchTerm, };
      const response = await matchApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response.listMatch.Matches);
        setTotalResult(response.listMatch.totalResults);
      }
    } catch (error) {
      console.error("Failed to fetch match", error);
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteMatch(selectedMatachId);
      if (response?.status === 200) {
        toast.success(response.message);
        setOpen(false);
        // Refresh data
        await refreshmatch();
      }
    } catch (err) {
      console.error("Failed to delete match", err);
      setLoading(false);
    }finally {
      setLoading(false);
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
      const response = await matchApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response?.listMatch?.Matches);
         setTotalResult(response.listMatch.totalResults);
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
      const response = await matchApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response?.listMatch?.Matches);
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


  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? (
        <LoadingSpinner />
      ) : null}

      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        {/* Add Matches Button */}
        <div className='search-wrap'>
          <Link to='/admin/match/update-match/'>
            <button className="custom-button">
              Add Match
            </button>
          </Link>

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
                height: "50px",
                width: "100%",
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
                    >
                      {ucwords(item)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {(sortOrderData as IMatchTable[]).map(
                  (row: IMatchTable) => {
                    return (
                      <TableRow key={row._id} sx={{"&:last-child td, &:last-child th": { border: 0 },}}>
                         <TableCell align='left'>
                      {row?.homeTeam?.shortName} <span style={{ fontWeight: 'bold', color: 'rgb(209, 119, 23)', margin: '0 8px' }}>
                        VS</span> {row?.awayTeam?.shortName}</TableCell>
                        <TableCell align='left'>{row?.zone}</TableCell>
                        <TableCell className={dataTable.productwrp}component='th' scope='row'>
                          {row?.round}
                        </TableCell>
                        <TableCell align="left">{(row?.homeTeam?.score ?? 'NA')} - {(row?.awayTeam?.score ?? 'NA')}
                        </TableCell>

                        <TableCell align='left'>
                          <div className={dataTable.actionwrap}>
                            <Link to={`/admin/match/update-match/${row._id}`} state={{ fromPage: currentPage }} >
                              <p className={dataTable.edit}>
                                <FontAwesomeIcon
                                  icon={faPencilAlt}
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
                  }
                )}

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
            color: "red",
            fontWeight: "700",
          }}
        >
          {t("Delete Match")}
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
            {t("Are you sure you want to delete this match?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose} className='btn-cancel'>
            {t("Cancel")}
          </Button>
          <Button onClick={handleDelete} className='btn'>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
