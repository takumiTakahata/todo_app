"use client";
import { useState, useEffect } from "react";
import TaskList from "../type/type";

export default function TodoList() {
    //  登録されたタスクを格納するstate
    const [list, setList] = useState<TaskList[]>([]);
    
    useEffect(() => {
        // APIからタスクの一覧を取得する
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
    },[])

   
    return (
        <>
            <h2>タスク一覧</h2>
            {list.length > 0 ? (
                list.map((task) => (
                    <div key={task.id}>
                        <p>{task.task}</p>
                    </div>
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </>
    )
}
