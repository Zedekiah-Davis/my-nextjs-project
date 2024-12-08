import ClientComponent from './components/ClientComponent';
import { getAllTodos } from '../../api';

export default async function Home() {
  // Fetch tasks on the server
  const tasks = await getAllTodos();

  // Pass tasks as props to ClientComponent
  return (
    <main className="max-w-4xl mx-auto mt-4">
      <ClientComponent tasks={tasks} />
    </main>
  );
}
