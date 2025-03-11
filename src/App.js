import React from "react";
import TaskManager from "./components/TaskManager/TaskManager"; // Importing TaskManager component
import { ThemeProvider } from "./context/ThemeContext"; // Import the ThemeProvider from ThemeContext

function App() {
  return (
    <ThemeProvider>
      {/* Wrap TaskManager with ThemeProvider */}
      <div className="App">
        <TaskManager />
      </div>
    </ThemeProvider>
  );
}

export default App;
