import Image from "next/image";
import styles from "./page.module.css";
import TodoForm from "./components/TodoForm";
export default function Home() {
  return (
    <>
      <h1>Todo App</h1>
      <TodoForm />
    </>
  );
}
