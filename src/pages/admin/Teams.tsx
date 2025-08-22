import { useEffect, useState } from "react";
import TeamsTable from "../../components/tables/customTable/TeamsTable";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { ITeamsTable } from "../../interfaces/Itable";
import { teamsHeader } from "../../constants/tables";
import { teamsApi } from "../../service/apis/team.api";
import withRole from "../withRole";
import { useLocation } from "react-router-dom";

function Teams() {
  const [data, setData] = useState<ITeamsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const limit = 10;
  const location = useLocation();
  const getTeams = async () => {
    setLoading(true);

    try {
      const bodyData = {
        currentPage: location.state?.fromPage||1,
        limit: limit,
      };
      const response = await teamsApi(bodyData);
      if (response) {
        setData(response?.Teams);
        setTotalUser(response?.totalResults);
        setTotalPage(response?.totalPages);
        setCurrentPage(response?.page);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  return (
    <section className='team-pages'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TeamsTable
          limit={limit}
          headData={teamsHeader}
          bodyData={data as ITeamsTable[]}
          totalData={totalUser}
          totalPage={totalPage}
          dataCurrentPage={currentPage}
        />
      )}
    </section>
  );
}

export default withRole(Teams, ["admin"]);
