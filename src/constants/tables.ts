import React from "react";
import  images  from "../constants/images";
export const adminUsersHeader = [
  "Profile Image",
  "Name",
  "Email",
  "Role",
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

export const adminFieldsHeader  = [
    { key: "name", label: "Name" },
    {
      key: "createdAt",
      label: "Created At",
      render: (v:any) => new Date(v).toLocaleDateString(),
    },
    { key: "actions", label: "Actions" },
  ];
export const getAdminGamesHeader = (role: any) => {
  const baseHeaders = [
    { key: "homeTeamName", label: "Home" },
    { key: "awayTeamName", label: "Away" },
    {
      key: "startDateTime",
      label: "Start Time",
      render: (v:any) => new Date(v).toLocaleDateString(),
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
