"use client";
import { useState, useEffect } from "react";
import TaskList from "../type/type";
import TodoDelete from "../components/TodoDelete";
import TodoUpdate from "../components/TodoUpdate";

export default function TodoList() {
    //  登録されたタスクを格納するstate
    const [list, setList] = useState<TaskList[]>([]);
    
    useEffect(() => {
        // json-serverからタスクの一覧を取得する
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/tasks", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    },
                }); 
                const result = await response.json();
                setList(result);
            } catch (error) {
                console.error("Error:",error);
            }
        }
        fetchData();
    },[list])

    const handleDeleteSuccess = (id: string) => {
    setList(list.filter((task) => task.id !== id)); // 削除されたタスクをリストから除去
    };
   
    return (
        <>
            <h2>タスク一覧</h2>
            {list.length > 0 ? (
                list.map((task) => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center',}}>
                        <TodoUpdate taskName={task.task} taskId={task.id} onUpdateSuccess={handleDeleteSuccess} />
                        <TodoDelete taskId={task.id} onDeleteSuccess={handleDeleteSuccess} />
                    </div>
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </>
    )
}
