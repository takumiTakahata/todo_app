"use client";

import { useState } from "react";
export default function TodoForm() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() === "") return;

    // タスクをjson-serverに送信
    const response = await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: task }),
    });
    if (response.ok) {
      const newTask = await response.json();
      setTasks([...tasks, newTask.task]);
      setTask("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="タスクを入力"
        />
        <button type="submit">追加</button>
      </form>
    </>
  );
}
