
import React, { useState, useCallback } from 'react';
import { BotSimulator } from './components/BotSimulator';
import { TaskChecklist } from './components/TaskChecklist';
import { ReportGenerator } from './components/ReportGenerator';
import { PresentationHelper } from './components/PresentationHelper';
import { TeamRoles } from './components/TeamRoles';
import { ProjectOverview } from './components/ProjectOverview';
import { MarketPulse } from './components/MarketPulse';
import { NewsSummary } from './components/NewsSummary';
import { PromptViewer } from './components/PromptViewer';
import { BotIcon, CheckSquare, FileText, Presentation, Users, LayoutDashboard, LineChart, TerminalSquare, Newspaper } from './components/Icons';
import { PromptProvider } from './context/PromptContext';

type View = 'overview' | 'simulator' | 'checklist' | 'reporter' | 'presenter' | 'team' | 'market' | 'prompt' | 'news';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('overview');

  const NavItem: React.FC<{
    view: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ view, icon, label }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-sky-500 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    );
  };

  return (
    <PromptProvider>
      <div className="flex h-screen bg-slate-900 font-sans">
        <aside className="w-64 bg-slate-800 p-4 flex flex-col flex-shrink-0 border-r border-slate-700">
          <div className="flex items-center mb-8">
            <div className="p-2 bg-sky-500 rounded-lg">
              <BotIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold ml-3 text-white">Project Planner</h1>
          </div>
          <nav className="space-y-2 flex-1 overflow-y-auto">
            <NavItem view="overview" icon={<LayoutDashboard className="w-5 h-5" />} label="Project Overview" />
            <NavItem view="market" icon={<LineChart className="w-5 h-5" />} label="Market Pulse" />
            <NavItem view="news" icon={<Newspaper className="w-5 h-5" />} label="News Intelligence" />
            <NavItem view="simulator" icon={<BotIcon className="w-5 h-5" />} label="Bot Simulator" />
            <NavItem view="prompt" icon={<TerminalSquare className="w-5 h-5" />} label="Prompt Editor" />
            <NavItem view="checklist" icon={<CheckSquare className="w-5 h-5" />} label="Task Checklist" />
            <NavItem view="reporter" icon={<FileText className="w-5 h-5" />} label="Report Generator" />
            <NavItem view="presenter" icon={<Presentation className="w-5 h-5" />} label="Presentation Helper" />
            <NavItem view="team" icon={<Users className="w-5 h-5" />} label="Team Roles" />
          </nav>
          <div className="mt-auto pt-4 text-center text-xs text-slate-500 border-t border-slate-700">
            <p>Built for University Project</p>
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
        </aside>
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-900">
          <div className={activeView === 'overview' ? '' : 'hidden'}>
              <ProjectOverview />
          </div>
          <div className={activeView === 'market' ? '' : 'hidden'}>
              <MarketPulse />
          </div>
          <div className={activeView === 'news' ? '' : 'hidden'}>
              <NewsSummary />
          </div>
          <div className={activeView === 'simulator' ? '' : 'hidden'}>
              <BotSimulator />
          </div>
          <div className={activeView === 'prompt' ? '' : 'hidden'}>
              <PromptViewer />
          </div>
          <div className={activeView === 'checklist' ? '' : 'hidden'}>
              <TaskChecklist />
          </div>
          <div className={activeView === 'reporter' ? '' : 'hidden'}>
              <ReportGenerator />
          </div>
          <div className={activeView === 'presenter' ? '' : 'hidden'}>
              <PresentationHelper />
          </div>
          <div className={activeView === 'team' ? '' : 'hidden'}>
              <TeamRoles />
          </div>
        </main>
      </div>
    </PromptProvider>
  );
};

export default App;
