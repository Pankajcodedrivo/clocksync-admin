export const adminUsersHeader = [
  "Profile Image",
  "Name",
  "Email",
  "Role",
  "Actions",
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
