export interface ITask {
    id: string;        // Unique identifier for the task
    title: string;     // Name of the task
    dueDate: number;   // Unix timestamp for the due date
    isDone: boolean;   // Whether the task is completed
}
