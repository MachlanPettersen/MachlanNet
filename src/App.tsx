import { createGlobalStyle, ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation, BrowserRouter, Routes, Route } from "react-router-dom";
import { themes } from "./common/Theme/Colors";
import { ThemeContext } from "./common/Theme/ThemeContext";
import ThemeToggle from "./common/Theme/ThemeToggle";
import BackButton from "./common/BackButton";
import Home from "./home/Home";
import GuestBook from "./guests/GuestBook";
import UnderConstruction from "./common/UnderConstruction";
import Contact from "./contact/Contact";
import About from "./about/About";

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
  }
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
  const location = useLocation();
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

  const showBackButton = location.pathname !== "/";

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {showBackButton && <BackButton />}
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<UnderConstruction />} />
          <Route path="/projects" element={<UnderConstruction />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/guestbook" element={<GuestBook />} />
          <Route path="*" element={<Home />} />
        </Routes>
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
