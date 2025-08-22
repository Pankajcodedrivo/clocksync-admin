import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { dashboardApi } from "../../service/apis/auth.api";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  // const [dashboardData, setDashboardData] = useState<any>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string>("");
  // const { t } = useTranslation();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await dashboardApi({});
  //       if(data.status===200){
  //         setDashboardData(data);
  //       }
  //     } catch (err) {
  //       setError("Failed to load dashboard data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  // const handleCardClick = (route: string) => {
  //   navigate(route);
  // };

  // if (loading) {
  //   return <LoadingSpinner/>;
  // }
  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
      <div className="dashboard-card">
      <h1>Coming Soon...</h1>
      </div>
    </>
    // <section className="dashboard-holder">
    //   <h1 className='title'>{t("Welcome to your dashboard")}</h1>
    //   <div className="dashboard-menu-wrapper">
    //     <div className="dashboard-menu-card-holder">
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/users")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalUsers}</span>
    //         <h2>Total User</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11.99 2c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10m3.61 6.34c1.07 0 1.93.86 1.93 1.93s-.86 1.93-1.93 1.93s-1.93-.86-1.93-1.93c-.01-1.07.86-1.93 1.93-1.93m-6-1.58c1.3 0 2.36 1.06 2.36 2.36s-1.06 2.36-2.36 2.36s-2.36-1.06-2.36-2.36c0-1.31 1.05-2.36 2.36-2.36m0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96c1.05-1.12 3.67-1.69 5.14-1.69c.53 0 1.2.08 1.9.22c-1.64.87-1.9 2.02-1.9 2.68M11.99 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13c1.07 0 2.92.39 3.84 1.15c-1.17 2.97-4.06 5.09-7.45 5.09"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/transactions")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalTransactions}</span>
    //         <h2>Total Transaction</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9c0-1.02 1.11-1.39 1.81-1.39c1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.24V5h-2v1.26c-2.48.56-2.49 2.86-2.49 2.96c0 2.27 2.25 2.91 3.35 3.31c1.58.56 2.28 1.07 2.28 2.03c0 1.13-1.05 1.61-1.98 1.61c-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 2.9 2.96V19h2v-1.24c.4-.09 2.9-.59 2.9-3.22c0-1.39-.61-2.61-3.01-3.44M3 21H1v-6h6v2H4.52c1.61 2.41 4.36 4 7.48 4a9 9 0 0 0 9-9h2c0 6.08-4.92 11-11 11c-3.72 0-7.01-1.85-9-4.67zm-2-9C1 5.92 5.92 1 12 1c3.72 0 7.01 1.85 9 4.67V3h2v6h-6V7h2.48C17.87 4.59 15.12 3 12 3a9 9 0 0 0-9 9z"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/withdrawals")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalWithdrawals}</span>
    //         <h2>Total withdrawal</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M8.88 5H6.24l-1.5 3h2.64zm10.38 3l-1.5-3h-2.64l1.5 3zM11 16.68V10H5.44zm2 0L18.56 10H13zM12.88 5h-1.76l-1.5 3h4.76z" opacity="0.3"/><path fill="currentColor" d="M19 3H5L2 9l10 12L22 9zm-1.24 2l1.5 3h-2.65l-1.5-3zM6.24 5h2.65l-1.5 3H4.74zM11 16.68L5.44 10H11zM9.62 8l1.5-3h1.76l1.5 3zM13 16.68V10h5.56z"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/withdrawals")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalPendingWithdrawals}</span>
    //         <h2>Pending withdrawal</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 11c0 2.45 1.76 4.47 4.08 4.91l-1.49-1.49L7 13l4 4.01L7 21l-1.41-1.41l1.58-1.58v-.06A7.007 7.007 0 0 1 1 11c0-3.87 3.13-7 7-7h3v2H8c-2.76 0-5 2.24-5 5m19 0V4h-9v7zm-2-2h-5V6h5zm-7 4h9v7h-9z"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/reports")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalReports}</span>
    //         <h2>User Reports</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 10h11v2H3zm0-2h11V6H3zm0 8h7v-2H3zm15.01-3.13l.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71zm-.71.71l-5.3 5.3V21h2.12l5.3-5.3z"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/reports")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.unresolvedReports}</span>
    //         <h2>Total pending User reports</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5m1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.7 6.7 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2m-6 2c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/support")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.totalSupportRequests}</span>
    //         <h2>Total Support Request</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28c-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path fill="currentColor" d="M18 11.03A6.04 6.04 0 0 0 12.05 6c-3.03 0-6.29 2.51-6.03 6.45a8.07 8.07 0 0 0 4.86-5.89c1.31 2.63 4 4.44 7.12 4.47"/></svg>
    //           </div>
    //       </div>
    //       <div className="dashboard-menu-card"onClick={() => handleCardClick("/admin/support")}>
    //         <div className="total-digits">
    //           <span>{dashboardData.getPendingSupports}</span>
    //         <h2>Pending Support Request</h2>
    //         </div>
    //         <div className="dashboard-menu-card-icon">
    //         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 23.59v-3.6c-5.01-.26-9-4.42-9-9.49C2 5.26 6.26 1 11.5 1S21 5.26 21 10.5c0 4.95-3.44 9.93-8.57 12.4zM11.5 3C7.36 3 4 6.36 4 10.5S7.36 18 11.5 18H13v2.3c3.64-2.3 6-6.08 6-9.8C19 6.36 15.64 3 11.5 3m-1 11.5h2v2h-2zm2-1.5h-2c0-3.25 3-3 3-5c0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5"/></svg>
    //           </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}

export default withRole(Dashboard, ["admin"]);
