import { useEffect, useState } from "react";
import RoundScheduleTable from "../../components/tables/customTable/RoundScheduleTable";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import { IRoundScheduleTable } from "../../interfaces/Itable";
import { RoundSchuduleHeader } from "../../constants/tables";
import { roundList } from "../../service/apis/matches.api";
import withRole from "../withRole";

function roundScheduleDate() {
  const [data, setData] = useState<IRoundScheduleTable[]>([]);
  const [loading, setLoading] = useState(true);

  const getRoundSchedule = async () => {
    setLoading(true);

    try {
      const response = await roundList();
      if (response) {
        setData(response?.rounds);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoundSchedule();
  }, []);

  return (
    <section className='team-pages'>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <RoundScheduleTable
          headData={RoundSchuduleHeader}
          bodyData={data as IRoundScheduleTable[]}
        />
      )}
    </section>
  );
}

export default withRole(roundScheduleDate, ["admin"]);
