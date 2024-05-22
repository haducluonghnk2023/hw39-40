import React, { useReducer } from "react";
import "./App.css";
interface Todo {
  id: number;
  name: string;
  status: boolean;
}
export default function App() {
  const jobLocal = localStorage.getItem("todos");

  const initial = {
    todos: jobLocal ? JSON.parse(jobLocal) : [],
    isloading: false,
    todo: {
      id: 0,
      name: "",
      status: false,
    },
    error: "",
    editingId: false,
    showModal: false,
    deleteTodoId: null,
  };

  const saveData = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const action = (type: string, payload: any) => {
    return {
      type,
      payload,
    };
  };

  const reducer = (state: any = initial, action: any) => {
    switch (action.type) {
      case "CHANG_INPUT":
        return {
          ...state,
          todo: { ...state.todo, name: action.payload },
        };
      case "ADD_TODO":
        if (!action.payload.name) {
          return {
            ...state,
            error: "tên công việc không được phép để trống",
          };
        }
        if (state.editingId !== null) {
          const updatedTodos = state.todos.map((todo: Todo) =>
            todo.id === state.editingId
              ? { ...todo, name: action.payload.name }
              : todo
          );
          saveData("todos", updatedTodos);
          return {
            ...state,
            todos: updatedTodos,
            todo: { ...state.todo, name: "" },
            error: "",
            editingId: null,
          };
        }
        const job = {
          id: Math.floor(Math.random() * 1000000000),
          name: action.payload.name,
          status: false,
        };

        // Clone ra mảng mới và thêm phần tử vào mảng mới đó
        const newState = [...state.todos, job];

        // Lưu dữ liệu vào local storage
        saveData("todos", newState);

        return {
          ...state,
          todos: newState,
          todo: {
            ...state.todo,
            name: "",
          },
          error: "",
        };

      case "UPDATE_TODO":
        if (!action.payload.name.trim()) {
          return {
            ...state,
            error: "Tên công việc không được phép để trống.",
          };
        }
        const updatedTodos = state.todos.map((todo: Todo) =>
          todo.id === state.editingId
            ? { ...todo, name: action.payload.name }
            : todo
        );
        saveData("todos", updatedTodos);
        return {
          ...state,
          todos: updatedTodos,
          todo: { id: 0, name: "", status: false },
          editingId: false,
          error: "",
        };
      case "EDIT_TODO":
        return {
          ...state,
          todo: { ...action.payload },
          editingId: action.payload.id,
        };

      case "DELETE_TODO":
        const filteredTodos = state.todos.filter(
          (todo: Todo) => todo.id !== action.payload
        );
        saveData("todos", filteredTodos);
        return {
          ...state,
          todos: filteredTodos,
          showModal: false,
          deleteTodoId: null,
        };
      case "CLEAR_ERROR":
        return {
          ...state,
          error: "",
        };
      case "SHOW_MODAL":
        return {
          ...state,
          showModal: true,
          deleteTodoId: action.payload,
        };
      case "HIDE_MODAL":
        return {
          ...state,
          showModal: false,
          deleteTodoId: null,
        };

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initial);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    dispatch(action("CHANG_INPUT", inputValue));
  };
  const addTodo = (e: any) => {
    e.preventDefault();
    dispatch(action("ADD_TODO", state.todo));
  };

  const clearError = () => {
    dispatch(action("CLEAR_ERROR", null));
  };

  const handleEdit = (todo: Todo) => {
    dispatch(action("EDIT_TODO", todo));
  };

  const handleShowModal = (id: number) => {
    dispatch(action("SHOW_MODAL", id));
  };

  const handleHideModal = () => {
    dispatch(action("HIDE_MODAL", null));
  };

  const handleDelete = () => {
    if (state.deleteTodoId !== null) {
      dispatch(action("DELETE_TODO", state.deleteTodoId));
      handleHideModal(); // Ẩn modal sau khi xóa công việc
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <link rel="stylesheet" href="./index.css" />
      {/* Font Awesome */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        rel="stylesheet"
      />
      {/* MDB */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/7.1.0/mdb.min.css"
        rel="stylesheet"
      />
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form className="d-flex justify-content-center align-items-center mb-4">
                    <div className="form-outline flex-fill">
                      <input
                        value={state.todo.name}
                        onChange={handleChange}
                        type="text"
                        id="form2"
                        className="form-control"
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button
                      type="submit"
                      onClick={addTodo}
                      className="btn btn-info ms-2"
                    >
                      {state.editingId ? "cập nhật " : "thêm"}
                    </button>
                  </form>
                  {/* Tabs navs */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active">Tất cả</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Đã hoàn thành</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Chưa hoàn thành</a>
                    </li>
                  </ul>
                  {/* Tabs navs */}
                  {/* Tabs content */}
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {state.todos.map((todo: Todo) => (
                          <li
                            key={todo.id}
                            className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                            style={{ backgroundColor: "#f4f6f7" }}
                          >
                            <div>
                              <input
                                className="form-check-input me-2"
                                type="checkbox"
                                checked={todo.status}
                              />
                              {todo.status ? (
                                <s>{todo.name}</s>
                              ) : (
                                <span>{todo.name}</span>
                              )}
                            </div>
                            <div className="d-flex gap-3">
                              <i
                                className="fas fa-pen-to-square text-warning"
                                onClick={() => handleEdit(todo)}
                              />
                              <i
                                className="far fa-trash-can text-danger"
                                onClick={() => handleShowModal(todo.id)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal xác nhận xóa */}
      {state.showModal && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Xác nhận</h5>
              <i className="fas fa-xmark" onClick={handleHideModal} />
            </div>
            <div className="modal-body-custom">
              <p>Bạn chắc chắn muốn xóa công việc?</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={handleHideModal}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cảnh báo lỗi */}
      {state.error && (
        <div className="overlay">
          <div className="modal-custom">
            <div className="modal-header-custom">
              <h5>Cảnh báo</h5>
              <i className="fas fa-xmark" onClick={clearError} />
            </div>
            <div className="modal-body-custom">
              <p>{state.error}</p>
            </div>
            <div className="modal-footer-footer">
              <button className="btn btn-light" onClick={clearError}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MDB */}
    </>
  );
}
