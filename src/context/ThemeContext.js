import React, { createContext, useState, useEffect } from "react";

// Create a ThemeContext with default value 'light'
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Step 1: Retrieve the theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(savedTheme);

  // Step 2: Store the theme in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Step 3: Function to toggle theme between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
