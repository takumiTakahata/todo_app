import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
export default function Home() {
  return (
    <>
      <h1>Todo App</h1>
      <TodoForm />
      <TodoList />
    </>
  );
}
