
import React from 'react';
import { usePrompt, DEFAULT_PROMPT_DATA } from '../context/PromptContext';

/**
 * A textarea that automatically adjusts its height to fit the content.
 */
const AutoResizingTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'inherit';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]);

    return <textarea ref={textareaRef} {...props} />;
};


/**
 * A collapsible and editable section for displaying parts of the prompt.
 */
const EditablePromptSection: React.FC<{
  title: string;
  name: keyof typeof DEFAULT_PROMPT_DATA;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ title, name, value, onChange }) => (
  <details className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
    <summary className="p-4 cursor-pointer font-semibold text-white hover:bg-slate-700/50">
      {title}
    </summary>
    <div className="p-4 border-t border-slate-700">
      <AutoResizingTextarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-900/50 p-3 rounded-md text-slate-300 text-sm font-mono whitespace-pre-wrap resize-none overflow-hidden focus:ring-2 focus:ring-sky-500 focus:outline-none"
      />
    </div>
  </details>
);

export const PromptViewer: React.FC = () => {
    const { promptData, setPromptData } = usePrompt();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromptData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Interactive Prompt Editor</h2>
                    <p className="text-slate-400 mt-1">
                        Modify the AI's instructions below. Your changes will be used by the Bot Simulator.
                    </p>
                </div>
                <button
                    onClick={() => setPromptData(DEFAULT_PROMPT_DATA)}
                    className="mt-4 sm:mt-0 bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors flex-shrink-0"
                >
                    Reset to Default
                </button>
            </div>
            
            <div className="space-y-4">
                <EditablePromptSection title="Role & Constraints" name="role" value={promptData.role} onChange={handleInputChange} />
                <EditablePromptSection title="Critical Constraints" name="constraints" value={promptData.constraints} onChange={handleInputChange} />
                <EditablePromptSection title="Mandatory External Data Usage" name="dataUsage" value={promptData.dataUsage} onChange={handleInputChange} />
                <EditablePromptSection title="As-of Date Integrity Rule" name="asOfDate" value={promptData.asOfDate} onChange={handleInputChange} />
                <EditablePromptSection title="Data Verification Protocol" name="verification" value={promptData.verification} onChange={handleInputChange} />
                <EditablePromptSection title="Inputs Template" name="inputsTemplate" value={promptData.inputsTemplate} onChange={handleInputChange} />
                <EditablePromptSection title="Methodology: 3-Scenario Framework" name="methodology" value={promptData.methodology} onChange={handleInputChange} />
                <EditablePromptSection title="Stock Analysis" name="stockAnalysis" value={promptData.stockAnalysis} onChange={handleInputChange} />
                <EditablePromptSection title="Confidence Formula" name="confidence" value={promptData.confidence} onChange={handleInputChange} />
                <EditablePromptSection title="Mandatory Stress Tests" name="stressTests" value={promptData.stressTests} onChange={handleInputChange} />
                <EditablePromptSection title="Research Logbook" name="logbook" value={promptData.logbook} onChange={handleInputChange} />
                <EditablePromptSection title="Quality Controls" name="qualityControls" value={promptData.qualityControls} onChange={handleInputChange} />
            </div>
        </div>
    );
};
