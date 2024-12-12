'use client';

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { useState, FormEventHandler } from "react";
import { addTodo } from "../../../api";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../firebase/config";

const AddTask = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");
  const [newDueDate, setNewDueDate] = useState<string>("");

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const userId = user.uid;

    // Convert dueDate string to a timestamp (number)
    const dueDateTimestamp = new Date(newDueDate).getTime();

    const newTask = {
      id: uuidv4(),
      title: newTaskValue.trim(),
      dueDate: dueDateTimestamp, // Ensure it's a number (timestamp)
      isDone: false,
    };

    try {
      await addTodo(userId, newTask);
      setNewTaskValue("");
      setNewDueDate("");
      setModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <button onClick={() => setModalOpen(true)} className="btn btn-primary w-full">
        Add New Task <AiOutlinePlus className="ml-1" size={10} />
      </button>

      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <form onSubmit={handleSubmitNewTodo}>
          <h3 className="font-bold text-lg">Add new task</h3>
          <div className="modal-action">
            <input
              value={newTaskValue}
              onChange={(e) => setNewTaskValue(e.target.value)}
              type="text"
              placeholder="Task title"
              className="input input-bordered w-full"
            />
            <input
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              type="date"
              className="input input-bordered w-full"
            />
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTask;
