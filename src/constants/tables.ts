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

export const getAdminGamesHeader = (role:any) => {
  const baseHeaders = [
    { key: "homeTeamLogo",  label: "" },
    { key: "homeTeamName", label: "Home" },
    { key: "awayTeamLogo", label: "" },
    { key: "awayTeamName", label: "Away" },
    { key: "startDateTime", label: "Start Time" },
    { key: "endDateTime", label: "End Time" },
  ];

  // Only include assignedUser column if role is NOT scorekeeper
  if (role !== "scorekeeper") {
    baseHeaders.push({ key: "assignUserId", label: "ScoreKeeper" });
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
