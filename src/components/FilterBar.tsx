'use client';

import { Search, Filter, X } from 'lucide-react';
import { clsx } from 'clsx';

type FilterStatus = 'all' | 'active' | 'completed';
type Priority = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH';

interface FilterBarProps {
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  search: string;
  setSearch: (search: string) => void;
}

export default function FilterBar({
  status,
  setStatus,
  priority,
  setPriority,
  search,
  setSearch,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4 sticky top-4 z-10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {(['all', 'active', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors",
                status === s
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <Filter size={16} className="text-gray-400" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="text-sm text-gray-600 bg-transparent outline-none cursor-pointer hover:text-gray-900"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
}