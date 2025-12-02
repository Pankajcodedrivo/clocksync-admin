const sidebarNav = [
  {
    link: "/admin/dashboard",
    section: "dashboard",
    icon: "lucide:layout-dashboard", //width:"20"
    text: "Dashboard",
    role: ["admin","event-director"],
  },
  {
    link: "/admin/users",
    section: "users",
    icon: "ph:users-bold", //width:"20"
    text: "Users",
    role: ["admin"],
  },
  {
    link: "/events",
    section: "events",
    icon: "ph:calendar-bold", //width:"20"
    text: "Events",
    role: ["admin"],
  },
  {
    link: "/admin/users/scorekeeper",
    section: "users",
    icon: "ph:users-bold", //width:"20"
    text: "Scorekeeper",
    role: ["event-director"],
  },
  {
    link: "/fields",
    section: "fields",
    icon: "mdi:stadium", //width:"20"
    text: "Fields",
    role: ["admin","event-director"],
  },
  {
    link: "/games",
    section: "games",
    icon: "mdi:gamepad", //width:"20"
    text: "Games",
    role: ["admin","scorekeeper","event-director"],
  },
  
  // {
  //   link: "/admin/pages",
  //   section: "pages",
  //   icon: "mdi:file-document-outline", //width:"20"
  //   text: "Pages",
  //   role: ["admin"],
  // },
   {
    link: "/universal-clock",
    section: "universal-clock",
    icon: "mdi:cog", //width:"20"
    text: "Universal Clock",
    role: ["event-director"],
  },
  {
    link: "/admin/settings",
    section: "settings",
    icon: "mdi:cog", //width:"20"
    text: "Settings",
    role: ["admin"],
  },
];

export default sidebarNav;
