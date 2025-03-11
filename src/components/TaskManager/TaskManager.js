import React, {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import "./TaskManager.css";
import { ThemeContext } from "../../context/ThemeContext";

// Define the initial state
const initialState = {
  tasks: [],
  newTaskTitle: "",
  newTaskDescription: "",
};

// Define the reducer function
const taskReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "TOGGLE_TASK_COMPLETION":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case "SET_NEW_TASK_TITLE":
      return { ...state, newTaskTitle: action.payload };
    case "SET_NEW_TASK_DESCRIPTION":
      return { ...state, newTaskDescription: action.payload };
    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                title: action.payload.title,
                description: action.payload.description,
              }
            : task
        ),
      };
    default:
      return state;
  }
};

const TaskManager = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // State to track focus on the task title input
  const [isFocused, setIsFocused] = useState(false);

  // Create a ref for the task title input field
  const taskTitleInputRef = useRef(null);

  // Load saved tasks from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      savedTasks.forEach((task) => {
        dispatch({ type: "ADD_TASK", payload: task });
      });
    }

    // Focus on the task title input field when the component mounts
    if (taskTitleInputRef.current) {
      taskTitleInputRef.current.focus();
      console.log("Auto-focused on input field!"); // Debugging statement
      setIsFocused(true); // Update state to highlight input
    }
  }, []);

  // Save tasks to localStorage when tasks change
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
      alert("Task list updated!");
    }
  }, [state.tasks]);

  // Memoize the addTask function
  const addTask = useCallback(() => {
    if (state.newTaskTitle.trim() && state.newTaskDescription.trim()) {
      const newTask = {
        id: Date.now(),
        title: state.newTaskTitle,
        description: state.newTaskDescription,
        completed: false,
      };
      dispatch({ type: "ADD_TASK", payload: newTask });
      dispatch({ type: "SET_NEW_TASK_TITLE", payload: "" });
      dispatch({ type: "SET_NEW_TASK_DESCRIPTION", payload: "" });
    }
  }, [state.newTaskTitle, state.newTaskDescription]);

  // Memoize the deleteTask function
  const deleteTask = useCallback((taskId) => {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  }, []);

  // Memoize the toggleTaskCompletion function
  const toggleTaskCompletion = useCallback((taskId) => {
    dispatch({ type: "TOGGLE_TASK_COMPLETION", payload: taskId });
  }, []);

  // Memoize the editTask function
  const editTask = useCallback(
    (taskId) => {
      const taskToEdit = state.tasks.find((task) => task.id === taskId);
      if (taskToEdit) {
        dispatch({ type: "SET_NEW_TASK_TITLE", payload: taskToEdit.title });
        dispatch({
          type: "SET_NEW_TASK_DESCRIPTION",
          payload: taskToEdit.description,
        });
        // This could open a modal or switch input fields for editing (optional)
        dispatch({ type: "DELETE_TASK", payload: taskId }); // Temporarily removing the task for editing
      }
    },
    [state.tasks]
  );

  const handleTitleChange = (e) => {
    dispatch({ type: "SET_NEW_TASK_TITLE", payload: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    dispatch({ type: "SET_NEW_TASK_DESCRIPTION", payload: e.target.value });
  };

  return (
    <div className={`task-manager-container ${theme}`}>
      <h1 className="app-title">Task Manager</h1>

      {/* Dark Mode Toggle */}
      <button className="dark-mode-toggle" onClick={toggleTheme}>
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      {/* Add New Task Form */}
      <div className="task-form">
        <input
          type="text"
          className={`task-input ${isFocused ? "highlighted" : ""}`} // Conditionally add the highlighted class
          placeholder="Task Title"
          value={state.newTaskTitle}
          onChange={handleTitleChange}
          ref={taskTitleInputRef} // Attach the ref to the input field
        />
        <input
          type="text"
          className="task-input"
          placeholder="Task Description"
          value={state.newTaskDescription}
          onChange={handleDescriptionChange}
        />
        <button
          className="add-task-btn"
          onClick={addTask}
          disabled={
            !state.newTaskTitle.trim() || !state.newTaskDescription.trim()
          }
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {state.tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <div className="task-title">{task.title}</div>
            <div className="task-description">{task.description}</div>

            <button
              className="edit-btn"
              onClick={() => editTask(task.id)} // Edit task
            >
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
            <button
              className="complete-incomplete-btn"
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
