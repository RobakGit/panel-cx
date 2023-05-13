import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import HeaderContainer from "@/components/header/headerContainer";
import SideNavigationBarContainer from "@/components/navigation/sideNavigationBarContainer";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      primary: { main: "#6C0A95" },
      background: { default: "#F5F5F5" },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <HeaderContainer />
      <SideNavigationBarContainer />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
