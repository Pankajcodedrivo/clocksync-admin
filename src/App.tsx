import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import LoadingSpinner from "./components/UI/loadingSpinner/LoadingSpinner";
import FormCus from "./components/UI/form/FormCus";
import ChangePass from "./components/form/ChangePass";
import "./scss/App.scss";
import "./scss/custom.scss";

const NotFound = React.lazy(() => import("./pages/NotFound"));
const NotAuthorized = React.lazy(() => import("./pages/NotAuthorized"));
const Login = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const DashboardPage = React.lazy(() => import("./pages/admin/Dashboard"));

const UpdateUser = React.lazy(() => import("./pages/admin/UpdateUser"));

const Users = React.lazy(() => import("./pages/admin/Users"));

// const Pages = React.lazy(() => import("./pages/admin/Pages"));

// const AddPage = React.lazy(() => import("./pages/admin/AddPage"));

const Settings = React.lazy(() => import("./pages/admin/Settings"));
const Teams = React.lazy(() => import("./pages/admin/Teams"));
const TeamDetails = React.lazy(() => import("./pages/admin/TeamDetails"));
const TeamAdd = React.lazy(() => import("./pages/admin/TeamAdd"));

const Match=React.lazy(()=>import("./pages/admin/Match"));
const MatchUpdate=React.lazy(()=>import("./pages/admin/MatchUpdate"));
const RoundSchedule=React.lazy(()=>import("./pages/admin/roundScheduleDate"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='/admin/profile' element={<FormCus />} />
              <Route path='/admin/changePassword' element={<ChangePass />} />
              <Route path='/admin/settings' element={<Settings />} />

              <Route path='/admin/dashboard' element={<DashboardPage />} />
              <Route path='/admin/users' element={<Users />} />
              <Route path='/admin/users/update-user/:id?'element={<UpdateUser />}/>
              {/* <Route path='/admin/pages' element={<Pages />} />
              <Route path='/admin/page/edit/:id?' element={<AddPage />} /> */}
              <Route path='/admin/teams' element={<Teams />} />
              <Route path='/admin/teams/:id' element={<TeamDetails />} />
              <Route path='/admin/teams/add' element={<TeamAdd />} />
              <Route path='/admin/round-schedule-date' element={<RoundSchedule/>} />
              <Route path='/admin/match' element={<Match/>} />
              <Route path='/admin/match/update-match/:id?' element={<MatchUpdate/>} />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
