import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

const App = () => {
  const [username, setUsername] = useState("");
  const [uid, setUID] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [registerMode, setRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [taskInput, setTaskInput] = useState("");

  const [draggedTaskId, setDraggedTaskId] = useState(null);


  const API_BASE_URL = "https://a6dubey-task.onrender.com";


  const displayMessage = (message) => {
    if (message) {
      window.alert(message);
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password
      })
      if (response.data.success) {
        
        setUID(response.data.user._id);
        setLoggedIn(true);
      } else {
        displayMessage(response.data.message);
        setRegisterMode(true);
      }
    } catch (error) {
      displayMessage();
      console.error(error);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        password,
        email,
      });
      displayMessage(response.data.message);
      console.log(response.data)
      if (response.data.success) {
        
        setUID(response.data.newUser._id);
        setLoggedIn(true);
      }
    } catch (error) {
      
      console.error(error);
    }
  };

  const handleTaskInputChange = (listId, value) => {
    setTaskInput((prevTaskInput) => ({
      ...prevTaskInput,
      [listId]: value,
    }));
  };

  const handleAddTask = async (listId) => {
    if (taskInput[listId] === "") {
      // Check if the task title is empty or contains only whitespace
      displayMessage("Please enter Task Title");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        title: taskInput[listId],
        listId,
      });
      if (response.data.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleMoveTask = async (taskId, oldListId, newListId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${taskId}`,
        {
          listId: newListId,
        }
      );
      
      if (response.data.success) {
        // Remove the task from the old list
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, listId: newListId } : task
          )
        );
      }displayMessage(response.data.message+". Press Ok to see the changes");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/tasks/${taskId}`
      );
      displayMessage(response.data.message);
      if (response.data.success) {
        
        fetchTasks();
      }
    } catch (error) {
      
      console.error(error);
    }
  };

  const fetchLists = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lists/${uid}`);
      if (response.data.success) {
        setLists(response.data.lists);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateList = async () => {
    if (listTitle.trim() === "") {
      // Check if the list title is empty or contains only whitespace
      window.alert("Please enter List Title");
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/lists`, {
        title: listTitle,
        userId: uid,
      });
      if (response.data.success) {
        fetchLists();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      if (response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch lists and tasks on initial load
    if (loggedIn) {
      fetchLists();
      fetchTasks();
    }
  }, [loggedIn]);

  return (
    <div className="app-container">
      {loggedIn ? (
        <div className="app-title">
          <h2>Welcome, {username}!</h2>

          <input
            type="text"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            placeholder="Enter list title"
            className="list-title-input"
          />
          <button className="create-list-button" onClick={handleCreateList}>
            Create List
          </button>
          <div className="list-container">
            {lists.map((list) => (
              <div className="list-item" key={list._id}>
                <h3 className="list-title">{list.title}</h3>
                <div className="task-input-container">
                  <input
                    type="text"
                    value={taskInput[list._id] || ""}
                    onChange={(e) =>
                      handleTaskInputChange(list._id, e.target.value)
                    }
                    placeholder="Enter task"
                    className="task-input"
                  />
                  <button onClick={() => handleAddTask(list._id)}>
                    Add Task
                  </button>
                </div>
                <div className="task-list">
                  {tasks
                    .filter((task) => task.listId === list._id)
                    .map((task) => (
                      <div
                        className={`task-content ${
                          draggedTaskId === task._id ? "dragged" : ""
                        }`}
                        key={`${task._id}-${list._id}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", task._id);
                          setDraggedTaskId(task._id);
                        }}
                        onDragEnd={(e) => {
                          setDraggedTaskId(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          const taskId = e.dataTransfer.getData("text/plain");
                          handleMoveTask(taskId, task.listId, list._id);
                        }}
                      >
                        {task.title}
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="complete-button"
                        >
                          Complete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : registerMode ? (
        <form onSubmit={handleRegister} className="form-container">
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
      ) : (
        <div className="form-container">
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>



          <div className="register-now">
            <span>Not registered? </span>
            <button
            type="button"
            onClick={() => setRegisterMode(true)}
            className="register-button"
          >
            Register Now
          </button>
          </div>
          
        </form>
      </div>
      )}
    </div>
  );
};

export default App;
