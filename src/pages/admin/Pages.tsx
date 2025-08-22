import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonTable from "../../components/tables/customTable/CommonTable";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { IFaqTable } from "../../interfaces/Itable";
import tabwrap from "./tabwrap.module.scss";
import { pagesHeader } from "../../constants/tables";
import withRole from "../withRole";
import { Tabs, Tab, Box } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import { useNavigate } from "react-router-dom";
import { pageList, deletePage } from "../../service/apis/page.api";
import toast from "react-hot-toast";

function Pages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<IFaqTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPageList, setTotalPageList] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const limit = 10;

  // Fetch users based on selected tab (role)
  const getPages = async (searchTerm: string) => {
    setLoading(true);
    try {
      let payload = {};
      if (searchTerm) {
        payload = {
          search: searchTerm,
        };
      }
      const response = await pageList(payload, currentPage, limit);
      if (response?.status === 200) {
        if (response?.pages?.pages.length == 0 && response?.pages?.page > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          setData(response?.pages?.pages);
          setTotalPageList(response?.pages?.totalResults);
          setTotalPage(response?.pages?.totalPages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await deletePage(id);
      toast.success(response);
      await getPages("");
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    getPages("");
  }, [currentPage]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    getPages(term);
  };

  return (
    <section className='search-pages-holder'>
      {/* Tab Navigation */}

      {/* Conditional Rendering for Data */}
      {loading ? (
        <LoadingSpinner /> // Show loading spinner while data is loading
      ) : (
        <CommonTable
          title='Page'
          limit={limit}
          headData={pagesHeader}
          bodyData={data as IFaqTable[]}
          totalData={totalPageList}
          totalPage={totalPage}
          searchTerm={searchTerm}
          dataCurrentPage={currentPage}
          changePage={handlePageChange}
          deleteMessage='Are you sure you want to delete this Page?'
          handleDelete={handleDelete}
          searchChange={handleSearchChange}
          slug='page'
        />
      )}
    </section>
  );
}

export default withRole(Pages, ["admin"]);
