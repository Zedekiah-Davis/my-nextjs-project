'use client';

import { FormEventHandler, useState } from "react";
import { ITask } from "../../../types/tasks";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { addTodo, deleteTodo, editTodo } from "../../../api";

interface TaskProps {
  task: ITask;
  userId: string; // Add userId as a required prop
}

const Task: React.FC<TaskProps> = ({ task, userId }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo(userId, {
      id: task.id,
      text: taskToEdit,
    });
    setOpenModalEdit(false);
    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(userId, id);
    setOpenModalDeleted(false);
    router.refresh();
  };

  const handleAddTask: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  
    if (!taskToEdit.trim()) {
      console.error("Task text cannot be empty");
      return; // Prevent adding empty tasks
    }
  
    const newTask = { text: taskToEdit.trim(), id: "" }; // Ensure 'text' is properly defined
    try {
      const addedTask = await addTodo(userId, newTask); // Call the fixed addTodo function
      console.log("Task added:", addedTask);
      setTaskToEdit(""); // Reset the input field after successful addition
      setOpenModalEdit(false);
      router.refresh(); // Refresh the task list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <tr key={task.id}>
      <td className="w-full">{task.text}</td>
      <td className="flex gap-5">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          cursor={"pointer"}
          className="text-blue-500"
          size={25}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="font-bold text-lg">Edit Task</h3>
            <div className="modal-action">
              <input
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDeleted(true)}
          cursor={"pointer"}
          className="text-red-500"
          size={25}
        />
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">
            Are you sure you want to delete this task?
          </h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

export default Task;
