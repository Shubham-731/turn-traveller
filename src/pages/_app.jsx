import "@/styles/globals.css";
import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "@/utils/theme";
import createEmotionCache from "@/utils/createEmotionCache";
import { StyledEngineProvider } from "@mui/material/styles";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache({
  key: "css",
  prepend: true,
});

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Turntraveller is a flight booking company that offers a user-friendly platform for travelers to easily search and book flights to their desired destinations. With a vast selection of airlines and flight options, Turntraveller provides customers with competitive prices and convenient travel arrangements. The company also offers 24/7 customer support to ensure a seamless booking experience for all customers."
        />
        <title>Turn Traveller</title>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </StyledEngineProvider>
    </CacheProvider>
  );
}
