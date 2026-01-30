
import React, { useState, useMemo } from 'react';
import { INITIAL_TASKS } from '../constants';
import { Task, TaskCategory } from '../types';
import { Card } from './Card';

/**
 * An interactive checklist component for tracking project tasks.
 * It displays tasks grouped by category and shows overall project progress.
 */
export const TaskChecklist: React.FC = () => {
  // State to hold the list of tasks and their completion status.
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  /**
   * Toggles the 'completed' status of a specific task.
   * @param {number} id - The ID of the task to toggle.
   */
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  /**
   * Memoized calculation for the number of completed tasks.
   * This avoids recalculating on every render unless the `tasks` array changes.
   */
  const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  /**
   * Memoized calculation to group tasks by their category.
   * This improves performance by preventing re-grouping on every render.
   */
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<TaskCategory, Task[]>);
  }, [tasks]);

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Project Task Checklist</h2>
      <p className="text-slate-400 mb-6">Track your progress through the project deliverables.</p>

      {/* Progress Bar */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-white">Overall Progress</span>
            <span className="text-lg font-bold text-sky-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
          <div 
            className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </Card>

      {/* Task Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map((category) => (
          <Card key={category}>
            <h3 className="text-xl font-semibold text-sky-400 mb-4">{category}</h3>
            <div className="space-y-3">
              {groupedTasks[category].map(task => (
                <label key={task.id} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500"
                  />
                  <span className={`ml-3 text-slate-300 group-hover:text-white ${task.completed ? 'line-through text-slate-500' : ''}`}>
                    {task.text}
                  </span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
