const sidebarNav = [
  {
    link: "/admin/dashboard",
    section: "dashboard",
    icon: "lucide:layout-dashboard", //width:"20"
    text: "Dashboard",
    role: ["admin"],
  },
  {
    link: "/admin/field",
    section: "field",
    icon: "mdi:stadium", //width:"20"
    text: "Field",
    role: ["admin"],
  },
  {
    link: "/game",
    section: "game",
    icon: "mdi:gamepad", //width:"20"
    text: "Game",
    role: ["admin","scorekeeper"],
  },
  {
    link: "/admin/users",
    section: "users",
    icon: "ph:users-bold", //width:"20"
    text: "Users",
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
