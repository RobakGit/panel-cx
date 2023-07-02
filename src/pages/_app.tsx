import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import HeaderContainer from "@/components/header/headerContainer";
import SideNavigationBarContainer from "@/components/navigation/sideNavigationBar/sideNavigationBarContainer";
import { Box } from "@mui/material";
import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const headerHeight = 63;
const drawerWidth = 240;

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(true);

  const Main = styled("main", {
    shouldForwardProp: prop => prop !== "open",
  })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    marginTop: `${headerHeight}px`,
    height: `calc(100vh - ${headerHeight}px)`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));

  const theme = createTheme({
    palette: {
      primary: { main: "#008080" },
      secondary: { main: "#fcf6fe" },
      background: { default: "#F5F5F5" },
    },
  });

  const handleSideBarOpen = () => {
    setOpen(true);
  };

  const handleSideBarClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }} className={`${inter.className}`}>
        <HeaderContainer headerHeight={headerHeight} />
        <SideNavigationBarContainer
          drawerWidth={drawerWidth}
          open={open}
          handleDrawerOpen={handleSideBarOpen}
          handleDrawerClose={handleSideBarClose}
        />
        <Main open={open}>
          <Component {...pageProps} />
        </Main>
      </Box>
    </ThemeProvider>
  );
}
