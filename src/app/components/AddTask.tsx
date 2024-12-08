'use client';

import { AiOutlinePlus } from "react-icons/ai";
import Modal from "./Modal";
import { useState, FormEventHandler } from "react";
import { addTodo } from "../../../api";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

const AddTask = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>("");

  const handleSubmitNewTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!newTaskValue.trim()) {
      console.error("Task text cannot be empty");
      return; // Prevent adding empty tasks
    }

    const userId = "example-user-id"; // Replace this with your user ID logic
    const newTask = {
      id: uuidv4(),
      text: newTaskValue.trim(),
    };

    console.log("New task being added:", newTask); // Debugging log

    try {
      await addTodo(userId, newTask); // Ensure 'addTodo' accepts these parameters
      setNewTaskValue("");
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
              placeholder="Type here"
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
