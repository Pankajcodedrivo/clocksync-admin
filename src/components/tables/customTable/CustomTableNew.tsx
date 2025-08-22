import React, { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";
import { Itable, complex, IUsersRoleTable } from "../../../interfaces/Itable";
import { useTranslation } from "react-i18next";
import noImage from "../../../assets/images/dummy.jpg";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Input, InputAdornment } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import dataTable from "./datatable.module.scss";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";
import { userApi, deleteUser, addAmount } from "../../../service/apis/user.api";

import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState("");

  const rowsPerPage = 10;

  const handleOpenDialog = (id: string) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAmount("");
  };

  const handleClickOpen = (userId: string) => {
    setSelectedUserId(userId);
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

      const response = await userApi(bodyData);
      if (response?.status === 200) {
        setLoading(false);
        setTotalResult(response?.users?.totalResults);
        setSortOrderData(response?.users?.users);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteUser(selectedUserId);
      if (response?.status === 200) {
        toast.success(response.message);
        setOpen(false);
        // Refresh data
        const bodyData = {
          currentPage: currentPage,
          limit: rowsPerPage,
          search: searchTerm,
        };
        const refreshResponse = await userApi(bodyData);
        if (refreshResponse?.status === 200) {
          setSortOrderData(refreshResponse?.users?.users);
          setTotalResult(refreshResponse?.users?.totalResults);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      setLoading(false);
    }
  };

  const handleSort = async (field: string) => {
    try {
      const bodyData = {
        currentPage: currentPage,
        limit: rowsPerPage,
        search: searchTerm,
      };
      const response = await userApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response?.users?.users);
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
      const response = await userApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response?.users?.users);
        setTotalResult(response?.users?.totalResults);
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
    // alert(page)
    try {
      setAddClass("add_blur");
      const bodyData = {
        currentPage: page,
        limit: rowsPerPage,
        search: searchTerm,
      };

      const response = await userApi(bodyData);

      if (response?.status === 200) {
        setSortOrderData(response?.users?.users);
        setLoading(false);
        setAddClass("");
      }
    } catch (err) {
      console.error("Failed to fetch page data", err);
    }
  };
  const ucwords = (str: string): string => {
    // Special case handling for FirstName
    const exceptions = ["FirstName"];

    return str
      .split(" ")
      .map((word) => {
        if (exceptions.includes(word)) {
          return word; // Leave it as it is if it's in the exceptions list
        }
        // Capitalize first letter of each word unless it's in exceptions
        return word.replace(/\b\w/g, (char: string) => char.toUpperCase());
      })
      .join(" ");
  };

  const handleSubmit = async () => {
    if (amount && selectedUserId) {
      try {
        const numericAmount = Number(amount);
        const bodyData = {
          amount: numericAmount,
        };
        const response = await addAmount(selectedUserId, bodyData);
        if (response?.status === 200) {
          toast.success(response.message);
          setOpenDialog(false);
          setAmount("");

          const refreshData = {
            currentPage: currentPage,
            limit: rowsPerPage,
            search: searchTerm,
          };
          const refreshResponse = await userApi(refreshData);
          if (refreshResponse?.status === 200) {
            setSortOrderData(refreshResponse?.users?.users);
            setTotalResult(refreshResponse?.users?.totalResults);
          }
        }
      } catch (error) {
        console.error("Error adding money:", error);
      }
    } else {
      console.error("Please provide a valid amount and user ID.");
    }
  };

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? (
        <LoadingSpinner /> // Show loading spinner while data is loading
      ) : null}

      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        {/* Add User Button */}
        <div className='search-wrap'>
          <Link to='/admin/users/update-user/'>
            <button className="table-btn" >
              Add User
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
                      onClick={() => handleSort(item)}
                    >
                      {ucwords(item)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {(sortOrderData as IUsersRoleTable[]).map(
                  (row: IUsersRoleTable) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align='left'>
                          <img
                            src={row?.profileimageurl || noImage}
                            alt='User'
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
                          {row?.fullName}
                        </TableCell>
                        <TableCell align='left'>{row?.email}</TableCell>
                        <TableCell align='left'>
                          {row?.amount || row.amount === 0
                            ? `$${row.amount}`
                            : "NA"}
                        </TableCell>
                        <TableCell align='left'>
                          <div className={dataTable.actionwrap}>
                            <Link to={`/admin/users/update-user/${row.id}`}state={{ fromPage: currentPage }}>
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
                              className={dataTable.edit}
                              onClick={() => handleOpenDialog(row.id)}
                            >
                              <FontAwesomeIcon
                                icon={faCircleDollarToSlot}
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              />
                            </p>

                            <p
                              className={dataTable.delete}
                              onClick={() => handleClickOpen(row.id)}
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
            count={Math.ceil(totalResult / rowsPerPage)} // total rows divided by rows per page
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
          {t("Delete User")}
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
            {t("Are you sure you want to delete this user?")}
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

      {/* Dialog Box for Adding Amount */}
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
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#ff8400",
            fontWeight: "700",
          }}
        >
          Add Amount
        </DialogTitle>
        <DialogContent>
          <Input
            autoFocus
            fullWidth
            type='number'
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
            inputProps={{ min: 0 }}
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog}
            color='primary'
            className='btn-cancel'
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary' className='btn'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomTable;
