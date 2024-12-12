'use client';

import { FormEventHandler, useState } from "react";
import { ITask } from "../../../types/tasks";
import { FiEdit, FiCheck, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { deleteTodo, editTodo } from "../../../api";

interface TaskProps {
  task: ITask;
  userId: string;
}

const Task: React.FC<TaskProps> = ({ task, userId }) => {
  const router = useRouter();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDeleted, setOpenModalDeleted] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.title);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await editTodo(userId, task.id, {
      title: taskToEdit,
      dueDate: task.dueDate,
      isDone: task.isDone,
    });
    setOpenModalEdit(false);
    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(userId, id);
    setOpenModalDeleted(false);
    router.refresh();
  };

  const handleToggleDone = async () => {
    try {
      await editTodo(userId, task.id, {
        title: task.title,
        dueDate: task.dueDate,
        isDone: !task.isDone,
      });
      router.refresh();
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <>
      <tr key={task.id} className="task-row">
        <td className="w-full">
          <span className={task.isDone ? "line-through text-gray-500" : ""}>
            {task.title}
          </span>
        </td>
        <td className="flex gap-5 items-center">
          {/* Checkmark Button */}
          <FiCheck
            onClick={handleToggleDone}
            cursor={"pointer"}
            className={`text-green-500 ${task.isDone ? "opacity-50" : ""}`}
            size={25}
          />
          {/* Edit Button */}
          <FiEdit
            onClick={() => setOpenModalEdit(true)}
            cursor={"pointer"}
            className="text-blue-500"
            size={25}
          />
          {/* Delete Button */}
          <FiTrash2
            onClick={() => setOpenModalDeleted(true)}
            cursor={"pointer"}
            className="text-red-500"
            size={25}
          />
        </td>
      </tr>
    
      {/* Modals outside of <tr> */}
      {/* Modal for editing task */}
      {openModalEdit && (
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
              <button type="submit" className="btn">Submit</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for confirming task deletion */}
      {openModalDeleted && (
        <Modal modalOpen={openModalDeleted} setModalOpen={setOpenModalDeleted}>
          <h3 className="text-lg">Are you sure you want to delete this task?</h3>
          <div className="modal-action">
            <button onClick={() => handleDeleteTask(task.id)} className="btn">
              Yes
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Task;
