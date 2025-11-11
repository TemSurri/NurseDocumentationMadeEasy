import { useState, useCallback } from "react";
import { motion } from "framer-motion";


import RecordingFunctionality from './recordingfunctionality'

const featureList = [
  { name: "SOAP", description: "Structured medical-style note format: Subjective, Objective, Assessment, and Plan." },
  { name: "Lifestyle", description: "Capture daily habits, routines, and lifestyle factors that affect wellbeing." },
  { name: "AI Insight", description: "Adds AI-powered interpretation to identify patterns or trends in your notes." },
];

const CheckFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 16l-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z" />
  </svg>
);

const CheckOutline = () => (
  <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12.5l2 2L15 10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RecordingState = "not-recording" | "recording" | "paused" | "finished";


export default function Interface() {
  const [features, setFeatures] = useState<string[]>(["SOAP"]);
  const [showInfo, setShowInfo] = useState<Record<string, boolean>>({});

  const [recordState, setRecordState] = useState<RecordingState>("not-recording")

  const isLocked = recordState !== "not-recording";

  const toggleFeature = useCallback((feature: string) => {
    if (isLocked) return;
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  }, [isLocked]);

  const toggleInfo = useCallback((feature: string) => {
    if (isLocked) return;
    setShowInfo((prev) => ({ ...prev, [feature]: !prev[feature] }));
  }, [isLocked]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-gray-200 shadow-lg p-5 sm:p-6 rounded-none"
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
          Recording Interface
        </h1>

        <div className="flex flex-col gap-2 mb-4">
          {featureList.map(({ name, description }) => {
            const selected = features.includes(name);
            const isVisible = showInfo[name];
            return (
              <motion.div
                key={name}
                layout
                transition={{ layout: { duration: 0.18, ease: "easeOut" } }}
                className={`border border-gray-300 p-3 flex items-start justify-between transition-all rounded-none ${
                  isLocked ? "bg-gray-100 opacity-70 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    disabled={isLocked}
                    onClick={() => toggleFeature(name)}
                    className="flex items-center gap-2 flex-shrink-0 mt-0.5"
                  >
                    {selected ? <CheckFilled /> : <CheckOutline />}
                    <span className="font-medium text-gray-800 text-sm sm:text-base">{name}</span>
                  </button>

                  {isVisible && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-gray-600 text-xs sm:text-sm leading-snug flex-1"
                    >
                      {description}
                    </motion.p>
                  )}
                </div>

                <button
                  disabled={isLocked}
                  onClick={() => toggleInfo(name)}
                  className={`text-[11px] sm:text-xs border px-2 py-1 transition-all rounded-none ${
                    isLocked
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-sky-600 hover:text-sky-700 border-sky-200"
                  }`}
                >
                  {isVisible ? "Hide" : "Info"}
                </button>
              </motion.div>
            );
          })}
        </div>

      <RecordingFunctionality features ={ features} recordState = {recordState} setRecordState = {setRecordState}/>

      </motion.div>
    </div>
  );
}
