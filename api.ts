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
    const tasksCollectionRef = collection(db, "users", userId.toString(), "todos"); // Ensure userId is a string
    const snapshot = await getDocs(tasksCollectionRef);
    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ITask[];
    return todos;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Create or fetch a user and add a task
export const addTodo = async (userId: string, todo: ITask): Promise<ITask> => {
  try {
    // Reference to the user's document
    const userDocRef = doc(db, "users", userId.toString());

    // Check if the user document exists
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // If the user doesn't exist, create their document
      await setDoc(userDocRef, { createdAt: new Date().toISOString() });
    }

    // Reference to the 'todos' sub-collection
    const todosCollectionRef = collection(userDocRef, "todos");

    // Add the task to the 'todos' sub-collection
    const docRef = await addDoc(todosCollectionRef, { text: todo.text });
    return { id: docRef.id, text: todo.text };
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Could not add task");
  }
};

// Edit an existing todo for a user
export const editTodo = async (userId: string, todo: ITask): Promise<ITask> => {
  try {
    const todoDocRef = doc(
      db,
      "users",
      userId.toString(),
      "todos",
      todo.id.toString() // Ensure todo.id is a string
    );
    await updateDoc(todoDocRef, { text: todo.text }); // Update only the 'text' field
    return todo;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Could not update task");
  }
};

// Delete a todo for a user
export const deleteTodo = async (userId: string, id: string): Promise<void> => {
  try {
    const todoDocRef = doc(
      db,
      "users",
      userId.toString(),
      "todos",
      id.toString() // Ensure id is a string
    );
    await deleteDoc(todoDocRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Could not delete task");
  }
};
