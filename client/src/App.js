import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import shortid from 'shortid';

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);
    socket.on('addTask', (task) => {
      addTask(task);
    });

    socket.on('removeTask', (id) => {
      removeTask(id, false);
    });

    socket.on('updateData', (allTasks) => {
      updateTasks(allTasks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function removeTask(taskId, emit = true) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (emit) {
      socket.emit('removeTask', taskId);
    }
  }

  function addTask(task) {
    setTasks((tasks) => [...tasks, task]);
  }

  function updateTasks(allTasks) {
    setTasks(allTasks);
  }

  function submitForm(e) {
    e.preventDefault();
    const task = { id: shortid.generate(), name: taskName };
    addTask(task);
    socket.emit('addTask', task);
    setTaskName('');
  }

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {task.name}
              <button
                className="btn btn--red"
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
