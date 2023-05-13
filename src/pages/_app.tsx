import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      primary: { main: "#6C0A95" },
      background: { default: "#F5F5F5" },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
