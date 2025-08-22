import React, { useState } from "react";
import {roundItable,complex,IRoundScheduleTable,} from "../../../interfaces/Itable";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Button,Dialog,DialogActions,
    DialogContent,DialogContentText,DialogTitle,TextField, MenuItem,} from "@mui/material";
import dataTable from "./datatable.module.scss";
import {roundList,roundDetails,addRoundSchedule,deleteRound,updateRoundSchedule,} from "../../../service/apis/matches.api";

import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

const RoundScheduleTable: React.FC<roundItable> = ({ bodyData, headData }) => {
  const [sortOrderData, setSortOrderData] = useState<complex[]>(bodyData);
  const [loading, setLoading] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ roundname: "", rounddate: "",roundorder: 0, });
  const [isEditMode, setIsEditMode] = useState(false);

  const roundOptions = [
    { value: 1, label: "1st Round" },
    { value: 2, label: "2nd Round" },
    { value: 3, label: "Sweet 16" },
    { value: 4, label: "Elite 8" },
    { value: 5, label: "Final Four" },
    { value: 6, label: "Championship" },
    { value: 7, label: "First Four" },
  ];
  
  const handleClickOpen = (id: string) => {
    setSelectedRoundId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
      const response = await deleteRound(selectedRoundId);
      if (response) {
        toast.success(response.message);
        fetchRoundSchedules();
      }
    } catch (error) {
      console.error("Error deleting round:", error);
    }
    setOpen(false);
  };
  const getRoundOrder = (roundname: string) => {
    const roundMap: { [key: string]: number } = {
      "1st Round": 1,
      "2nd Round": 2,
      "Sweet 16": 3,
      "Elite 8": 4,
      "Final Four": 5,
      "Championship": 6,
      "First Four":7
    };
    return roundMap[roundname] || 0;
  };
  const handleOpenDialog = (data?: IRoundScheduleTable) => {
    if (data) {
      setFormData({
        roundname: data.roundname,
        rounddate: data.rounddate,
        roundorder: getRoundOrder(data.roundname),
      });
      setIsEditMode(true);
      setSelectedRoundId(data._id);
    } else {
      setFormData({
        roundname: "",
        rounddate: "",
        roundorder: 0,
      });
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === "roundname") {
      const selectedRound = roundOptions.find((round) => round.value === Number(value));
      setFormData((prev) => ({
        ...prev,
        [name]: selectedRound?.label || "", 
        roundorder: selectedRound?.value || 0, 
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const response = await updateRoundSchedule(selectedRoundId!, formData);
        if (response) {
          toast.success(
            response.message || "Round schedule updated successfully"
          );
        }
      } else {
        const response = await addRoundSchedule(formData);
        if (response) {
          toast.success(
            response.message || "Round schedule added successfully"
          );
        }
      }
      setOpenDialog(false);
      fetchRoundSchedules();
    } catch (error) {
      // toast.error("An error occurred while saving the round schedule");
      console.log(error);
    }
  };
  const fetchRoundSchedules = async () => {
    setLoading(true);
    try {
      const response = await roundList();
      if (response) {
        setSortOrderData(response.rounds);
      }
    } catch (error) {
      console.error("Failed to fetch round schedules", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <div className={`${dataTable.datatablemainwrap} colorAction`}>
        <button
          className="custom-button"
          onClick={() => handleOpenDialog()}
        >
          Add New
        </button>
        <div className='usertabledata mt-20'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='simple table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  {headData.map((item, index) => (
                    <TableCell align='left' key={index}>
                      {ucwords(item)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {(sortOrderData as IRoundScheduleTable[]).map(
                  (row: IRoundScheduleTable) => {
                    return (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          className={dataTable.productwrp}
                          component='th'
                          scope='row'
                        >
                          {row?.roundname}
                        </TableCell>
                        <TableCell
                          className={dataTable.productwrp}
                          component='th'
                          scope='row'
                        >
                          {row?.rounddate}
                        </TableCell>
                        <TableCell align='left'>
                          <div className={dataTable.actionwrap}>
                            <p
                              className={dataTable.edit}
                              onClick={() => handleOpenDialog(row)}
                            >
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
          {"Delete Round Schedule"}
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
        open={openDialog}
        onClose={handleCloseDialog}
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
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {isEditMode ? "Edit Round Schedule" : "Add Round Schedule"}
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            label='Select Round'
            name='roundname'
            value={formData.roundorder}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            className="mat-inp-fix"
          >
            {roundOptions.map((round) => (
              <MenuItem key={round.value} value={round.value}>
                {round.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Schedule Month'
            name='rounddate'
            value={formData.rounddate}
            onChange={handleInputChange}
            fullWidth
            margin='normal'
            className="mat-inp-fix"
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px" }}>
          <Button onClick={handleCloseDialog} className='btn-cancel'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className='btn'>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoundScheduleTable;
