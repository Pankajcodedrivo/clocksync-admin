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
    link: "/admin/scorekeeper",
    section: "scorekeeper",
    icon: "ph:users-bold", //width:"20"
    text: "Subcribe Scorekeeper",
    role: ["admin"],
  },
  {
    link: "/admin/fields",
    section: "fields",
    icon: "mdi:stadium", //width:"20"
    text: "Fields",
    role: ["admin"],
  },
  {
    link: "/games",
    section: "games",
    icon: "mdi:gamepad", //width:"20"
    text: "Games",
    role: ["admin","scorekeeper"],
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
