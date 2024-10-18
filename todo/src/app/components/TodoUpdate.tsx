import { useState } from "react";

type Props = {
    taskName: string;
    taskId: string;
    onUpdateSuccess: (id: string) => void;
};

export default function TodoUpdate({ taskName, taskId, onUpdateSuccess }: Props) { 
    const [isUpdate, setIsUpdate] = useState(false);
    const [task, setTask] = useState(taskName);
    const handleUpdate = async () => {
        setIsUpdate(true);
        try {
            const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    task: task,
                }),
            });
            if (response.ok) {
                onUpdateSuccess(taskId);
            } else {
                console.error("Failed to update the task.");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsUpdate(false);
        }
    };
    return (
        <div>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={handleUpdate} disabled={isUpdate}>
                {isUpdate ? "Updating..." : "更新"}
            </button>
        </div>
    );
}
