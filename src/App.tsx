import axios from "axios";
import { useEffect, useState } from "react";
import { errorAlert, successAlert } from "./Alert";
import "./App.css";
import Loader from "./components/Loader";

interface Todo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const startEditing = (todo: Todo) => {
    setEditTodo(todo);
    setNewTodo(todo.title);
  };

  const updateTodo = async (todo: Todo) => {
    const body = {
      ...(editTodo as Todo),
      title: newTodo,
    };
    if (body.id > 200) {
      setTodos(
        todos.map((todoItem) => {
          if (todoItem.id === todo.id) {
            return body;
          }
          return todoItem;
        })
      );
      setEditTodo(null);
      setNewTodo("");
      setShowLoader(false)
      return;
    }
    setShowLoader(true);
    axios
      .put("https://jsonplaceholder.typicode.com/todos/" + todo.id, body)
      .then(function (response) {
        // handle success
        console.log(response.data, "update ==>", body);

        successAlert("Todo updated");
        setTodos(
          todos.map((todoItem) => {
            if (todoItem.id === todo.id) {
              return body;
            }
            return todoItem;
          })
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setEditTodo(null);
        setNewTodo("");
        setShowLoader(false);
      });
  };
  const deleteTodo = async (id: number) => {
    setShowLoader(true);
    axios
      .delete("https://jsonplaceholder.typicode.com/todos/" + id)
      .then(function (response) {
        // handle success
        console.log(response.data);

        successAlert("Successfully deleted!");
        setTodos(todos.filter((todoItem) => todoItem.id != id));
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setShowLoader(false);
      });
  };
  const toggleCompleted = async (todo: Todo) => {
    const body = {
      ...todo,
      completed: !todo.completed,
    };
    if (body.id > 200) {
      setTodos(
        todos.map((todoItem) => {
          if (todoItem.id === todo.id) {
            return body;
          }
          return todoItem;
        })
      );
      return;
    }
    setShowLoader(true);
    axios
      .put("https://jsonplaceholder.typicode.com/todos/" + todo.id, body)
      .then(function (response) {
        // handle success
        console.log(response.data);

        successAlert("Status changed");
        setTodos(
          todos.map((todoItem) => {
            if (todoItem.id === todo.id) {
              return body;
            }
            return todoItem;
          })
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setShowLoader(false);
      });
  };
  const addTodo = async () => {
    // Make a request for a user with a given ID
    if (!newTodo.trim()) {
      errorAlert("Title is empty");
      return;
    }
    setShowLoader(true);
    if (editTodo) {
      updateTodo(editTodo);
      return;
    }
    const body = {
      completed: false,
      userId: 1,
      title: newTodo,
    };
    axios
      .post("https://jsonplaceholder.typicode.com/todos", body)
      .then(function (response) {
        // handle success
        console.log(response.data);

        successAlert("Successfully added!");
        setTodos([response.data, ...todos]);
        setNewTodo("");
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setNewTodo("");
        setShowLoader(false);
      });
  };
  const loadTodos = async () => {
    // Make a request for a user with a given ID
    setShowLoader(true);
    axios
      .get("https://jsonplaceholder.typicode.com/todos")
      .then(function (response) {
        // handle success
        console.log(response.data);

        setTodos(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setShowLoader(false);
      });
  };
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <>
      {showLoader && (
        <div className="relative">
          <Loader />
        </div>
      )}
      <div
        style={{ pointerEvents: showLoader ? "none" : "auto" }}
        className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans"
      >
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
          <div className="mb-4">
            <h1 className="text-grey-darkest">Todo List</h1>
            <div className="flex mt-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                placeholder="Add Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button
                className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
                onClick={addTodo}
              >
                {editTodo ? "Update" : "Add"}
              </button>
            </div>
          </div>
          <div>
            {todos.map((todo) => (
              <div className="flex mb-4 items-center" key={todo.id}>
                <p
                  className={`w-full text-grey-darkest ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.title}
                </p>
                <button
                  onClick={() => toggleCompleted(todo)}
                  className={
                    "flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green"
                  }
                >
                  {todo.completed ? "Done" : "Not Done"}
                </button>
                <button
                  onClick={() => startEditing(todo)}
                  className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
