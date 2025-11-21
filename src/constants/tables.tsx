import React from "react";
import  images  from "./images";
import Switch from "@mui/material/Switch";

export const adminUsersHeader = [
  "Profile Image",
  "Name",
  "Email",
  "CreatedBy",
  "Actions",
];

export const adminScorekeeperHeader = [
  {
    key: "profileimageurl",
    label: "Profile Image",
    render: (url: string) =>
      React.createElement("img", {
        src: url || images.noimage,
        alt: "Profile",
        style: { width: "40px", height: "40px", borderRadius: "50%" },
      }),
  },
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
];

export const adminFieldsHeader = (
  onToggle: (id: string, val: boolean) => void,
  role: string
) => {
  const columns = [
    { key: "name", label: "Name" },
    {
      key: "unviseralClock",
      label: "Universal Clock",
      render: (_: any, row: any) => (
        <Switch
          checked={row.unviseralClock}
          onChange={(e) => onToggle(row._id, e.target.checked)}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (v: any) => new Date(v).toLocaleDateString(),
    },
    { key: "actions", label: "Actions" },
  ];

  // ✅ Conditionally add a new column immediately after "Name"
  if (role === "admin") {
    columns.splice(1, 0, {
      key: "createdBy.fullName",
      label: "Created By",
    
    });
  }
    columns.splice(2, 0, {
      key: "status",
      label: "Status",
      render: (v: any) => v==="approve"?"Approved":v==="pending"?"Pending":"Rejected",
    });
  

  return columns;
};


export const getAdminGamesHeader = (role: any) => {
  const baseHeaders = [
    { key: "homeTeamName", label: "Home" },
    { key: "awayTeamName", label: "Away" },
    {
      key: "startDateTime",
      label: "Start Time",
      render: (v:any) => new Date(v).toLocaleString(),
    },
    {
      key: "field.name",
      label: "Field",
    },
  ];

  if (role !== "scorekeeper") {
    baseHeaders.push({
      key: "assignedUser.fullName",
      label: "ScoreKeeper",
    });
  }

  if (role === "admin") {
    baseHeaders.push({
      key: "createdByUser.fullName",
      label: "CreatedBy",
    });
  }

  baseHeaders.push({ key: "actions", label: "Actions" });

  return baseHeaders;
};

export const getAdminEventsHeader = (role: any) => {
  const baseHeaders = [
    { key: "eventName", label: "Name" },
    {
      key: "startDate",
      label: "Start Date",
      render: (v:any) => new Date(v).toLocaleString(),
    },
  ];

  if (role === "admin") {
    baseHeaders.push({
      key: "assignedUser.fullName",
      label: "Event Director",
    });
  }

  baseHeaders.push({ key: "actions", label: "Actions" });

  return baseHeaders;
};


export const pagesHeader = {
  title: "Title",
  createdAt: "Date",
  actions: "Actions",
};
export const teamsHeader = [
  "Logo",
  "Team Name",
  "Location",
  "Status",
  "Actions",
];
export const MatchHeader = ["Team", "Zone", "Round", "Scores", "Actions"];
export const RoundSchuduleHeader = ["Round", "Round Schedule Date","Actions"];
