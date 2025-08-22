const sidebarNav = [
  {
    link: "/admin/dashboard",
    section: "dashboard",
    icon: "lucide:layout-dashboard", //width:"20"
    text: "Dashboard",
    role: ["admin"],
  },
  {
    link: "/admin/users",
    section: "users",
    icon: "ph:users-bold", //width:"20"
    text: "Users",
    role: ["admin"],
  },
  {
    link: "/admin/round-schedule-date",
    section: "round-schedule-date",
    icon: "ph:trophy", //width:"20"
    text: "Match Round",
    role: ["admin"],
  },
  {
    link: "/admin/match",
    section: "match",
    icon:"mdi:tournament", //width:"20"
    text: "Matches",
    role: ["admin"],
  },
  {
    link: "/admin/teams",
    section: "teams",
    icon: "ph:users-four", //width:"20"
    text: "Teams",
    role: ["admin"],
  },

  // {
  //   link: "/admin/pages",
  //   section: "pages",
  //   icon: "mdi:file-document-outline", //width:"20"
  //   text: "Pages",
  //   role: ["admin"],
  // },
  {
    link: "/admin/settings",
    section: "settings",
    icon: "mdi:cog", //width:"20"
    text: "Settings",
    role: ["admin"],
  },
];

export default sidebarNav;
