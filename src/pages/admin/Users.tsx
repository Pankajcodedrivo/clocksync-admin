import { useEffect, useState } from "react";
import CustomTableNew from "../../components/tables/customTable/CustomTableNew";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { IUsersRoleTable } from "../../interfaces/Itable";
import { adminUsersHeader } from "../../constants/tables";
import { userApi } from "../../service/apis/user.api";
import withRole from "../withRole";
import { Navigate, useLocation, useParams } from "react-router-dom";

function Customers() {
   const { currentRole } = useParams<{ currentRole?: string }>();

  // Set default role if empty or undefined
  const role = currentRole && currentRole.trim() ? currentRole : 'scorekeeper';
  const [data, setData] = useState<IUsersRoleTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const limit = 10;
  const location = useLocation();
  const getCustomer = async () => {
    setLoading(true);

    try {
      const bodyData = {
        currentPage: location.state?.fromPage||1,
        limit: limit,
        role:role
      };
      const response = await userApi(bodyData);
      if (response?.status === 200) {
        setData(response?.users?.users);
        setTotalUser(response?.users?.totalResults);
        setTotalPage(response?.users?.totalPages);
        setCurrentPage(response?.users?.page);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getCustomer();
  }, [role]);

  return (
    <section className='users-pages'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomTableNew
          limit={limit}
          headData={adminUsersHeader}
          bodyData={data as IUsersRoleTable[]}
          totalData={totalUser}
          totalPage={totalPage}
          dataCurrentPage={currentPage}
        />
      )}
    </section>
  );
}

export default withRole(Customers, ["admin","event-director"]);
