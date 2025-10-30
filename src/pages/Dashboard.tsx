import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Summary from "../components/summary/Summary";
import { getDashboardData } from "../service/apis/dashboard.api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


function Dashboard() {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const [data,setData] = useState([]);
   useEffect(() => {
      const fetchDropdowns = async () => {
        try {
          const dashboardData = await getDashboardData();
          if (dashboardData) setData(dashboardData);
        } catch (error) {
          console.error("Error fetching dropdown data:", error);
        }
      };
      fetchDropdowns();
    }, []);
  
  const { t } = useTranslation();
  return (
    <section>
      <h2 className='title'>{t("dashboard")}</h2>
      <Summary data={data} role={user?.role}/>
      {/* <SaleChart />
      <DashboardTables /> */ }
    </section>
  );
}

export default Dashboard;
