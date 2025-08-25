import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import dataTable from "./datatable.module.scss";
import delt from "../../../assets/images/delete.png";


export interface ColumnConfig<T> {
  key: keyof T | "actions";
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface CommonTableProps<T> {
  title: any;
  columns: ColumnConfig<T>[];
  bodyData: T[];
  totalData: number;
  dataCurrentPage: number;
  changePage?: (page: number) => void;
  deleteMessage?: string;
  handleDelete?: (id: string) => void;
  renderActions?: (row: T) => React.ReactNode;
}

function CommonTable<T extends { _id: string }>({
  title,
  columns,
  bodyData,
  totalData,
  dataCurrentPage,
  changePage,
  deleteMessage,
  handleDelete,
  renderActions,
}: CommonTableProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const rowsPerPage=10;
  const handleClickOpen = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  return (
    
        <>
        {/* 📊 Table */}
        <TableContainer className={dataTable.tbodymain} component={Paper}>
          <Table
            sx={{ minWidth: 1000 }}
            aria-label="dynamic table"
            style={{
              borderCollapse: "separate",
              borderSpacing: "0px 15px",
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((col, index) => (
                  <TableCell align="left" key={index}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody className={dataTable.tbodywrap}>
              
               {bodyData.length > 0 ? (
                bodyData.map((row:any) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {columns.map((col:any, idx) => (
                      <TableCell key={`${col.key}_${idx}`}>
                        {col.key === "actions"
                          ? renderActions
                            ? renderActions(row)
                            : null
                          : col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 📄 Pagination */}
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "30px" }}
        >
          <Pagination
            count={Math.ceil(totalData / rowsPerPage)}
            page={dataCurrentPage}
            onChange={(_, page) => changePage?.(page)}
            sx={{
              ".MuiPaginationItem-page": {
                backgroundColor: "#fff",
                color: "#414141",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                "&.Mui-selected": {
                  backgroundColor: "#E94257",
                  color: "#fff",
                  pointerEvents: "none",
                  cursor: "default",
                },
                "&:hover": {
                  backgroundColor: "#E94257",
                  color: "#fff",
                },
              },
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
            }}
          />
        </Stack>

      {/* 🗑️ Delete Confirmation Dialog */}
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
        className={dataTable.custommodal}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={dataTable.modalimg}>
          <img src={delt} alt="Delete Confirmation" />
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
          {t(`Delete ${title}`)}
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
            {deleteMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose} className="btn-cancel">
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              handleDelete?.(selectedId);
              handleClose();
            }}
            className="btn"
          >
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
}

export default CommonTable;
