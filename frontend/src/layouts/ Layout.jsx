// // import { Box } from "@mui/material";
// // import Sidebar from "../components/ Sidebar";
// // import Header from "../components/Header";
// // import { Outlet } from "react-router-dom";

// // function Layout({ darkMode, toggleDarkMode }) {
// //   return (
// //     <Box sx={{ display: "flex" }}>
// //       <Sidebar />

// //       <Box sx={{ flexGrow: 1 }}>
// //         <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
// //         <Outlet />
// //       </Box>
// //     </Box>
// //   );
// // }

// // export default Layout;

// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import { Box } from "@mui/material";
// import { Outlet } from "react-router-dom";

// function Layout({ children }) {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

//       <Box sx={{ flexGrow: 1 }}>
//         <Header toggleSidebar={handleDrawerToggle} />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }

// export default Layout;

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* SIDEBAR */}

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* MAIN CONTENT */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: "100%",
            md: `calc(100% - 240px)`
          },

          minHeight: "100vh",

          overflowX: "hidden",

          transition: "all 0.3s ease",

          boxSizing: "border-box"
        }}
      >
        {/* HEADER */}

        <Header toggleSidebar={handleDrawerToggle} />

        {/* PAGE CONTENT */}

        <Box
          sx={{
            width: "100%",

            maxWidth: "100%",

            overflowX: "hidden",

            boxSizing: "border-box",

            // mt: {
            //   xs: "56px",
            //   sm: "64px"
            // },

            // p: {
            //   xs: 1,
            //   sm: 2,
            //   md: 3
            // }
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;