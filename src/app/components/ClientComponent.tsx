'use client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import AddTask from './AddTask';
import ToDoList from './ToDoList';
import { ITask } from '../../../types/tasks';

interface ClientComponentProps {
  tasks: ITask[]; // Use ITask[] for the tasks prop
}

export default function ClientComponent({ tasks }: ClientComponentProps) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const userSession = JSON.parse(sessionStorage.getItem('user') || 'false');
    if (!user && !userSession) {
      router.push('/sign-in'); // Redirect to sign-in
    }
  }, [user, router]);

  return (
    <>
      <button
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem('user');
          router.push('/sign-in')
        }}
      >
        Log out
      </button>
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Todo List App</h1>
        <AddTask />
      </div>
      <ToDoList tasks={tasks} />
    </>
  );
}
