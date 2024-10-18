"use client";
import { useState } from "react";

type Props = {
  taskId: string;
  onDeleteSuccess: (id: string) => void;
};

export default function TodoDelete({ taskId, onDeleteSuccess }: Props) {
    const [isDelete, setIsDelete] = useState(false);
    const handleDelete = async () => {
        setIsDelete(true);
    try {
        // タスクをjson-serverに送信
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
        },
        });
         if (response.ok) {
        onDeleteSuccess(taskId); // 削除が成功した場合、親コンポーネントへ通知
      } else {
        console.error("Failed to delete the task.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDelete(false); // 処理完了後、削除状態をリセット
    }
  };
    return (
        <div>
            <button onClick={handleDelete} disabled={isDelete}>
                {isDelete ? "Deleting..." : "削除"}
            </button>
        </div>
    )
}
