import { getAuth } from "firebase/auth";
import { ITask } from "../../../types/tasks";
import React from "react";
import Task from "./Task";

interface TodoListProps {
  tasks: ITask[];
}

const ToDoList: React.FC<TodoListProps> = ({ tasks }) => {
  // Get the current user ID
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  if (!userId) {
    // Handle the case where the user is not authenticated
    return <div>Please log in to see your tasks.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* Head */}
        <thead>
          <tr>
            <th>Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {tasks.map((task) => (
            <Task key={task.id} task={task} userId={userId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToDoList;
