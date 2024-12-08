'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import AddTask from '../components/AddTask';
import ToDoList from '../components/ToDoList';
import { getAllTodos } from '../../../api';
import { ITask } from '../../../types/tasks';

export default function Home() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [user, loading, error] = useAuthState(auth);  // user state from Firebase hook
    const router = useRouter();

    // Check authentication status with user directly
    useEffect(() => {
        if (!user) {
            router.push('/auth'); // Redirect to sign-in page if no user is authenticated
        }
    }, [user, router]);

    // Fetch tasks on the server
    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                const fetchedTasks = await getAllTodos(user.uid); // Fetch tasks for the authenticated user
                setTasks(fetchedTasks);
            }
        };
        fetchTasks();
    }, [user]);

    const handleSignOut = () => {
        signOut(auth);
        router.push('/auth'); // Redirect to sign-in page after sign-out
    };

    return (
        <main className="max-w-4xl mx-auto mt-4">
            {user && (
                <>
                    <button
                        onClick={handleSignOut}
                        className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
                    >
                        Log out
                    </button>
                    <div className="text-center my-5 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold">Todo List App</h1>
                        <AddTask />
                    </div>
                    <ToDoList tasks={tasks} />
                </>
            )}
        </main>
    );
}
