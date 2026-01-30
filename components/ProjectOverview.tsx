
import React from 'react';
import { Card } from './Card';

/**
 * A component that displays the main project overview.
 * It serves as the landing page for the application, providing context
 * about the project's goals, requirements, and deliverables.
 * This is a static informational component.
 */
export const ProjectOverview: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">AI-Powered Telegram Trading Bot</h2>
            <p className="text-slate-400 max-w-3xl">
                This planner helps you navigate Project 2, which shifts the focus from external LLM exploration to practical, production-oriented development. You will apply core ML/DL concepts to build a functional, automated stock prediction system accessible via a Telegram bot.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-semibold text-sky-400 mb-3">Core Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li><strong>Bot Development:</strong> Fully functional Telegram Bot using a Python framework.</li>
                        <li><strong>AI Model Integration:</strong> Use a free, custom-trained AI model for predictions.</li>
                        <li><strong>Bot Functionality:</strong> Implement `/predict [Ticker]` and `Status` commands.</li>
                        <li><strong>Analysis:</strong> The integrated model must be validated.</li>
                    </ul>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold text-sky-400 mb-3">Deliverables</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>Written Report (max 20 pages)</li>
                        <li>Complete Bot Code (GitHub link)</li>
                        <li>Roles and Responsibilities Table</li>
                        <li>Logbook & Peer Evaluation</li>
                        <li>10-minute Presentation with Live Demo</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};
