import React, { useEffect, useState } from "react";
import {
  ICustomModelSettingstable,
  complex,
  IUsersRoleTable,
} from "../../../interfaces/Itable";
import { useTranslation } from "react-i18next";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import dataTable from "./datatable.module.scss";
import { userApi } from "../../../service/apis/user.api";

import LoadingSpinner from "../../../components/UI/loadingSpinner/LoadingSpinner";
import noImage from "../../../assets/images/no-images.svg";

const CustomTableModelSettings: React.FC<ICustomModelSettingstable> = ({
  bodyData,
  headData,
  totalData,
  onClickCheckBox,
  items,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrderData, setSortOrderData] = useState<complex[]>(bodyData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalResult, setTotalResult] = useState(totalData);
  const [loading, setLoading] = useState(false);
  const [addClass, setAddClass] = useState<string>("");
  const [allItems, setAllItems] = useState<any>(items);

  const rowsPerPage = 10;

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchTerm(searchQuery);

    try {
      setLoading(true);
      setAddClass("add_blur");
      const bodyData = {
        currentPage: currentPage,
        limit: 10,
        search: searchQuery,
        role: "model",
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

  const handleSort = async (field: string) => {
    try {
      const bodyData = {
        currentPage: currentPage,
        limit: 10,
        search: searchTerm,
        role: "model",
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
        page: 1,
        currentPage: 1,
        search: "",
        role: "model",
      };
      setLoading(true);
      const response = await userApi(bodyData);
      if (response?.status === 200) {
        setSortOrderData(response?.users?.users);
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
        role: "model",
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
  useEffect(() => {
    setAllItems(items);
  }, [items]);

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? (
        <LoadingSpinner /> // Show loading spinner while data is loading
      ) : null}

      <div
        className={`${dataTable.datatablemainwrap} customflex-left-inner ${
          addClass ? dataTable[addClass] : ""
        }`}
      >
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
        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='simple table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              className='featured_Profile_table'
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
                  (row: IUsersRoleTable, index: number) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align='left'>
                          <div
                            className={`${dataTable.actionwrap} checkfeaturedbox`}
                          >
                            <div key={index}>
                              <input
                                type='checkbox'
                                name='modelFeatured[]'
                                value={row?.id}
                                onChange={onClickCheckBox}
                                data-img={row?.profileimageurl || noImage}
                                data-name={row?.fullName}
                                checked={allItems.some(
                                  (item: any) => item.userId === row.id
                                )}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className={dataTable.productwrp}
                          component='th'
                          scope='row'
                        >
                          <div className='profileThholder'>
                            <div className='profileimgTh'>
                              <img
                                src={row?.profileimageurl || noImage}
                                alt='Profile Image'
                              />
                            </div>
                            <div className='profiletitleTh'>
                              {row?.fullName}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}

                {sortOrderData.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={2} align='center'>
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
                  backgroundColor: "#E94257",
                  color: "#fff",
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
      </div>
    </div>
  );
};

export default CustomTableModelSettings;
