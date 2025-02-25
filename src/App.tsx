import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { themes } from "./common/Theme/Colors";
import { ThemeContext } from "./common/Theme/ThemeContext";
import Home from "./home/Home";
import GuestBook from "./guests/GuestBook";
import UnderConstruction from "./common/UnderConstruction";
import Contact from "./contact/Contact";
import About from "./about/About";
import HeaderControls from "./navigation/HeaderControls";

const GlobalStyle = createGlobalStyle`
  * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text.primary};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  html, body {
    -ms-overflow-style: none; 
    scrollbar-width: none; 
  }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
`;

const PageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("isDarkTheme");
    return saved ? JSON.parse(saved) : false;
  });

  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    localStorage.setItem("isDarkTheme", JSON.stringify(isDark));
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <HeaderControls />
          <PageContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<UnderConstruction />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guestbook" element={<GuestBook />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </PageContainer>
        </Layout>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
