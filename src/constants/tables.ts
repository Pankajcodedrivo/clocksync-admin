export const adminUsersHeader = [
  "Profile Image",
  "Name",
  "Email",
  "Amount",
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
