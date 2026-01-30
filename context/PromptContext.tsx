
import React, { createContext, useState, useContext, useEffect } from 'react';

export const DEFAULT_PROMPT_DATA = {
  role: `You are a senior sell-side equity research analyst at Goldman Sachs/ Morgan Stanley, producing a 1-week tactical forecast for three large-cap technology stocks. Your mandate is to deliver an ex-ante, good-faith prediction using all available public data while maintaining strict integrity.`,
  constraints: `CRITICAL CONSTRAINTS:
ABSOLUTE PROHIBITION: No Target Date Outcomes
- ❌ DO NOT use realized prices/returns for the forecast horizon end date
- ❌ DO NOT use ex-post commentary like "the stock finished the week up 3%"
- ❌ DO NOT reference January 2, 2026 closing prices or weekly performance summaries
- ✅ Allowed: Any public data known ON OR BEFORE the "As-of Date"`,
  dataUsage: `MANDATORY EXTERNAL DATA USAGE (Minimum Requirements):
- REQUIRED: At least 6 external citations total across the analysis:
- ≥2 macro/economic sources (Fed, yields, CPI, etc.)
- ≥2 market/sector sources (index levels, flows, positioning)
- ≥2 company-specific sources (earnings, news, analyst notes)
- EVERY factual claim MUST have an inline citation [web:X]`,
  asOfDate: `As-of Date Integrity Rule:
- Pretend you are standing exactly on [AS-OF-DATE]
- Later articles OK only if they describe events ≤ AS-OF-DATE
- Discard any content revealing target week performance`,
  verification: `Data Verification Protocol (Execute First):
1. Verify each "Last Close Price" against ≥1 public source
2. If discrepancy >0.5%: Document both values + your choice + rationale
3. Cite verification sources explicitly`,
  inputsTemplate: `INPUTS TEMPLATE (Fill Before Running)
**As-of Date:** [AS-OF-DATE] (Thursday Pre-Market)
**Forecast Horizon:** 2026-01-02 (Friday Close)

**Last Close Prices (YYYY-MM-DD):**
MSFT: $XXX.XX | GOOGL: $XXX.XX | META: $XXX.XX

**Calendar Events (Next Week):**
- 2026-01-01: Markets Closed (New Year's Day)
- 2026-01-02: Normal trading hours

**Macro Context (Cite Sources):**
- 10Y Treasury: __% [web:X]
- S&P 500 YTD: __% [web:X]
- VIX: __ [web:X]`,
  methodology: `METHODOLOGY: 3-SCENARIO FRAMEWORK
SCENARIO ANALYSIS TABLE (BASKET LEVEL FIRST)
| Scenario | Probability | Basket % | Primary Drivers (3 Max) |
|---|---|---|---|
| BULL | 25-40% | +X.XX% | 1. [Trigger→Mechanism→Impact] [web:X]<br>2. [Trigger→Mechanism→Impact] [web:X]<br>3. [Trigger→Mechanism→Impact] |
| BASE | 45-55% | +X.XX% | 1. [Trigger→Mechanism→Impact]<br>2. [Trigger→Mechanism→Impact]<br>3. [Trigger→Mechanism→Impact] |
| BEAR | 15-25% | -X.XX% | 1. [Risk→Transmission→Impact] [web:X]<br>2. [Risk→Transmission→Impact]<br>3. [Risk→Transmission→Impact] |
| POINT | 100% | +X.XX% | Weighted: (B*P_B) + (S*P_S) + (R*P_R) |
Basket = Simple average of 3 stock % changes per scenario`,
  stockAnalysis: `STOCK ANALYSIS (REPEAT ×3)
[TICKER NAME] ([TICKER])

Last Close: $XXX.XX [Verified: web:X]
Point Forecast: $XXX.XX (+X.XX%)
Confidence: XX/100 [Formula + Penalties Below]
Scenario Range: Bull=$XXX | Base=$XXX | Bear=$XXX

SCENARIO NARRATIVE:
**BULL (+X.X%, P=X%)**: [Mechanism with citations]
**BASE (+X.X%, P=X%)**: [Mechanism with citations] 
**BEAR (-X.X%, P=X%)**: [Mechanism with citations]

STRESS TESTS:
1. Rates ±25bps → [Impact: X%] [Beta/Duration logic]
2. S&P -2% → [Impact: X%] [Historical beta evidence]
3. Company Shock → [Specific risk → X% move]

MOST SENSITIVE VARIABLE: [ONE: Yields/Flows/Earnings/Regulation]`,
  confidence: `CONFIDENCE FORMULA (MANDATORY CALCULATION)
Step 1: Raw Confidence = 100 × [1 - σ_scenarios / |Point Forecast|]
   σ_scenarios = StdDev([Bull%, Base%, Bear%])
   Clamp result to [0, 100]

Step 2: Information Gap Penalties (-10 pts each, max -50):
  ☐ Live Options Data
  ☐ Real-time Flows/Positioning  
  ☐ Company Guidance Detail
  ☐ Sector Rotation Metrics
  ☐ Macro Surprise Calendar

Step 3: Document: "Raw=XX → Final=XX (-XXpts: gaps X,Y,Z)"`,
  stressTests: `MANDATORY STRESS TESTS (All Three)
RATES SHOCK: "10Y Treasury ±25bps from current level"
MARKET SHOCK: "S&P 500 -2% over forecast week"
IDIO SHOCK: "[Company] negative headline/guidance cut"

For each stock: Quantify % impact + rank relative sensitivity.`,
  logbook: `RESEARCH LOGBOOK (EXACTLY 4 BULLETS)
- ASSUMPTIONS: [List 3-4 key modeling choices]
- SOURCES USED: [6+ citations categorized: macro=X, market=X, company=X]
- GAPS ACKNOWLEDGED: [What you DON'T know that matters]
- NEXT IMPROVEMENT: [One specific methodological upgrade]`,
  qualityControls: `QUALITY CONTROLS (CHECKLIST)
After providing all the above structured data, add a "rationale" field. In this field, write a concise, professional paragraph (3-5 sentences) justifying the overall forecast. Synthesize the key drivers from your scenario analysis, mentioning specific market signals, company news, or macro factors that led to your point forecast and scenario probabilities.
✅ No outcome leakage (no Jan 2 prices anywhere)
✅ ≥6 external citations with inline [web:X]
✅ Explicit causal chains (Trigger→Mechanism→Price)
✅ Basket math verified (3-stock avg = table values)
✅ Confidence calculated (show raw + penalties)
✅ Scenario probs sum to 100%
✅ Stress tests quantified (not just directional)`
};

export type PromptData = typeof DEFAULT_PROMPT_DATA;

interface PromptContextType {
    promptData: PromptData;
    setPromptData: React.Dispatch<React.SetStateAction<PromptData>>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export const PromptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [promptData, setPromptData] = useState<PromptData>(() => {
        try {
            const savedPrompt = localStorage.getItem('promptData');
            return savedPrompt ? JSON.parse(savedPrompt) : DEFAULT_PROMPT_DATA;
        } catch (error) {
            console.error("Failed to parse prompt data from localStorage", error);
            return DEFAULT_PROMPT_DATA;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('promptData', JSON.stringify(promptData));
        } catch (error) {
            console.error("Failed to save prompt data to localStorage", error);
        }
    }, [promptData]);

    return (
        <PromptContext.Provider value={{ promptData, setPromptData }}>
            {children}
        </PromptContext.Provider>
    );
};

export const usePrompt = (): PromptContextType => {
    const context = useContext(PromptContext);
    if (!context) {
        throw new Error('usePrompt must be used within a PromptProvider');
    }
    return context;
};
