import { ITask } from "./types/tasks";
import { db } from "./src/app/firebase/config";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Get all todos for a user
export const getAllTodos = async (userId: string): Promise<ITask[]> => {
  try {
    const tasksCollectionRef = collection(db, "users", userId, "todos");
    const snapshot = await getDocs(tasksCollectionRef);
    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ITask, "id">),
    }));
    return todos;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Add a new todo for a user
export const addTodo = async (userId: string, todo: ITask): Promise<ITask> => {
  try {
    const userDocRef = doc(db, "users", userId); // Reference to the user's document
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      await setDoc(userDocRef, { createdAt: new Date().toISOString() });
    }

    const todosCollectionRef = collection(userDocRef, "todos");
    // Set the document ID to be the same as the task's 'id' field
    const docRef = doc(todosCollectionRef, todo.id);
    await setDoc(docRef, todo); // Set the task data

    return { ...todo, id: docRef.id }; // Return the task with the Firestore document ID
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Could not add task");
  }
};

// Edit an existing todo (used for both title and isDone toggling)
export const editTodo = async (
  userId: string,
  taskId: string,
  updates: Partial<ITask>
): Promise<void> => {
  try {
    const todoDocRef = doc(db, "users", userId, "todos", taskId);
    await updateDoc(todoDocRef, updates); // Only update provided fields
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Could not update task");
  }
};

// Delete a todo
export const deleteTodo = async (userId: string, id: string): Promise<void> => {
  try {
    const todoDocRef = doc(db, "users", userId, "todos", id);
    await deleteDoc(todoDocRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Could not delete task");
  }
};
