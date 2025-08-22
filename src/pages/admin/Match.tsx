import { useEffect, useState } from "react";
import CustomMatchTable from "../../components/tables/customTable/CustomMatchTable";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { IMatchTable } from "../../interfaces/Itable";
import { MatchHeader } from "../../constants/tables";
import { matchApi } from "../../service/apis/matches.api";
import withRole from "../withRole";
import { useLocation } from "react-router-dom";

function Match() {
  const [matches, setmatch] = useState<IMatchTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalmatches, setTotalMatches] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const limit = 10;
    const location = useLocation();
  const getZone = async () => {
    setLoading(true);
    try {
      const bodyData = {
        currentPage: location.state?.fromPage||1,
        limit: limit,
      };
      const response = await matchApi(bodyData);
      if (response?.status === 200) {
        setmatch(response?.listMatch?.Matches);
        setTotalMatches(response?.listMatch?.totalResults);
        setTotalPage(response?.listMatch?.totalPages);
        setCurrentPage(response?.listMatch?.page);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getZone();
  }, []);

  return (
    <section className='users-pages'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <CustomMatchTable
          limit={limit}
          headData={MatchHeader}
          bodyData={matches as IMatchTable[]}
          totalData={totalmatches}
          totalPage={totalPage}
          dataCurrentPage={currentPage}
        />
      )}
    </section>
  );
}

export default withRole(Match, ["admin"]);
