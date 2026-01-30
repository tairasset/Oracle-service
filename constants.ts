import { Task, TeamMember } from './types';

export const STOCKS = [
    { ticker: 'META', name: 'Meta Platforms, Inc.' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corp.' },
];

export const REPORT_SECTIONS = [
    'System Architecture',
    'Model Training and Validation',
    'Bot Implementation',
    'Conclusion & Challenges',
];

export const INITIAL_TASKS: Task[] = [
    { id: 1, text: 'Choose Python framework (e.g., python-telegram-bot)', category: 'Bot Development', completed: false },
    { id: 2, text: 'Set up Telegram Bot with BotFather', category: 'Bot Development', completed: false },
    { id: 3, text: 'Implement /predict and Status commands', category: 'Bot Development', completed: false },
    { id: 4, text: 'Host the bot for demonstration (e.g., on Heroku, AWS)', category: 'Bot Development', completed: false },
    { id: 5, text: 'Select 3 companies and gather historical data', category: 'AI Model', completed: false },
    { id: 6, text: 'Build and train a custom prediction model', category: 'AI Model', completed: false },
    { id: 7, text: 'Integrate the trained model into the bot backend', category: 'AI Model', completed: false },
    { id: 8, text: 'Validate the model and report key metrics', category: 'AI Model', completed: false },
    { id: 9, text: 'Write the System Architecture section', category: 'Report & Deliverables', completed: false },
    { id: 10, text: 'Write Model Training and Validation section', category: 'Report & Deliverables', completed: false },
    { id: 11, text: 'Write Bot Implementation and UX analysis', category: 'Report & Deliverables', completed: false },
    { id: 12, text: 'Write the Conclusion and reflection', category: 'Report & Deliverables', completed: false },
    { id: 13, text: 'Compile final report, code, logbook, etc.', category: 'Report & Deliverables', completed: false },
    { id: 14, text: 'Create presentation slides', category: 'Presentation', completed: false },
    { id: 15, text: 'Prepare for the 10-minute live demonstration', category: 'Presentation', completed: false },
    { id: 16, text: 'Practice the presentation and demo flow', category: 'Presentation', completed: false },
];

export const INITIAL_TEAM: TeamMember[] = [
    { id: 1, name: 'Team Member 1', role: 'Project Lead / Backend Dev', responsibilities: 'Oversees project, develops Python backend.' },
    { id: 2, name: 'Team Member 2', role: 'ML Engineer', responsibilities: 'Data gathering, model training, and validation.' },
    { id: 3, name: 'Team Member 3', role: 'DevOps / QA', responsibilities: 'Bot deployment, testing, and documentation.' },
    { id: 4, name: 'Team Member 4', role: 'Report & Presentation Lead', responsibilities: 'Compiles the final report and presentation slides.' },
];