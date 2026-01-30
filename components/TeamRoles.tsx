
import React, { useState } from 'react';
import { INITIAL_TEAM } from '../constants';
import { TeamMember } from '../types';
import { Card } from './Card';

/**
 * A component for defining and editing team roles and responsibilities.
 * It displays an editable table of team members.
 */
export const TeamRoles: React.FC = () => {
  // State to hold the list of team members. Initialized with default data.
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);

  /**
   * Handles changes to the input fields in the team table.
   * It updates the state for the specific member and field being edited.
   * @param {number} id - The ID of the team member being edited.
   * @param {keyof TeamMember} field - The property of the team member to update (e.g., 'name', 'role').
   * @param {string} value - The new value from the input field.
   */
  const handleInputChange = (id: number, field: keyof TeamMember, value: string) => {
    setTeam(team.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Roles & Responsibilities</h2>
      <p className="text-slate-400 mb-6">Define and assign roles to each team member to ensure clear ownership of tasks.</p>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-600">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Role</th>
                <th className="p-4 text-sm font-semibold text-slate-300">Responsibilities</th>
              </tr>
            </thead>
            <tbody>
              {team.map(member => (
                <tr key={member.id} className="border-b border-slate-700 last:border-0">
                  <td className="p-4">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleInputChange(member.id, 'name', e.target.value)}
                      className="w-full bg-slate-700 text-white rounded-md px-3 py-1 border border-transparent focus:border-sky-500 focus:ring-0"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleInputChange(member.id, 'role', e.target.value)}
                      className="w-full bg-slate-700 text-white rounded-md px-3 py-1 border border-transparent focus:border-sky-500 focus:ring-0"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={member.responsibilities}
                      onChange={(e) => handleInputChange(member.id, 'responsibilities', e.target.value)}
                      className="w-full bg-slate-700 text-white rounded-md px-3 py-1 border border-transparent focus:border-sky-500 focus:ring-0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
