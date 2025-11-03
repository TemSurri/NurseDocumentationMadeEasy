import { useState, useEffect, useCallback} from "react";
import { motion, AnimatePresence } from "framer-motion";


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
    </svg>)

export default function Interface() {
  type RecordingState = "not-recording" | "recording" | "paused" | "finished";
  const [recordState, setRecordState] = useState<RecordingState>("not-recording");
  const [features, setFeatures] = useState<string[]>(["SOAP"]);
  const [showInfo, setShowInfo] = useState<Record<string, boolean>>({});
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [recordingDots, setRecordingDots] = useState<string>("");

  useEffect(() => {
    if (recordState === "recording") {
      let i = 0;
      const interval = setInterval(() => {
        setRecordingDots(".".repeat((i % 3) + 1));
        i++;
      }, 450);
      return () => clearInterval(interval);
    } else {
      setRecordingDots("");
    }
  }, []);

  const isLocked = recordState !== "not-recording";

  const toggleFeature = useCallback( (feature: string) => {
    if (isLocked) return;
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  }, [isLocked])

  const toggleInfo = useCallback((feature: string) => {
    if (isLocked) return;
    setShowInfo((prev) => ({ ...prev, [feature]: !prev[feature] }));
  }, [isLocked])

  const handleRecordToggle = () => {
    if (recordState === "not-recording") setRecordState("recording");
    else if (recordState === "recording") setRecordState("paused");
    else if (recordState === "paused") setRecordState("recording");
  };

  const handleFinish = () => setRecordState("finished");

  const handleGenerateNotes = () =>
    setGeneratedNotes(
      `quick some notes test
      big fat monkey boi
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      moneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkeymoneymonkey
      big
        `
    );

  const handleReset = () => {
    setRecordState("not-recording");
    setFeatures(["SOAP"]);
    setShowInfo({});
    setGeneratedNotes("");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-2xl p-5 sm:p-6"
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
                className={`border border-gray-300 rounded-lg p-3 flex items-start justify-between transition-all ${
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
                  className={`text-[11px] sm:text-xs border px-2 py-1 rounded-md transition-all ${
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

        <motion.div layout transition={{ duration: 0.18, ease: "easeOut" }} className="flex flex-wrap gap-3 justify-center mb-2">
          {recordState !== "finished" && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                animate={{
                  boxShadow:
                    recordState === "recording"
                      ? "0 0 15px rgba(56,189,248,0.4)"
                      : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{
                  repeat: recordState === "recording" ? Infinity : 0,
                  duration: 0.7,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
                onClick={handleRecordToggle}
                className={`flex-1 min-w-[140px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white transition-all duration-150 rounded-md ${
                  recordState === "recording"
                    ? "bg-teal-500 hover:bg-teal-600"
                    : recordState === "paused"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {recordState === "not-recording"
                  ? "Record"
                  : recordState === "recording"
                  ? "Pause"
                  : "Resume"}
              </motion.button>

              {(recordState === "recording" || recordState === "paused") && (
                <motion.button
                  key="finish-btn"
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={handleFinish}
                  className="flex-1 min-w-[120px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md"
                >
                  Finish
                </motion.button>
              )}
            </>
          )}
        </motion.div>

        <AnimatePresence>
          {recordState === "finished" && (
            <div className="flex flex-wrap gap-3 justify-center mb-2 -mt-1">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerateNotes}
                className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-md shadow-sm transition-all duration-150"
              >
                Generate Notes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-md transition-all duration-150"
              >
                Clear All
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        <div className="mt-3 w-full bg-gray-50 border border-gray-200 shadow-inner p-4 text-sm sm:text-base text-gray-700 rounded-md text-left whitespace-pre-wrap break-words font-mono tracking-wide min-h-[120px] leading-relaxed">
          {recordState === "recording" ? (
            <motion.span
              key="recording-status"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              className="text-sky-600 font-medium"
            >
              Recording{recordingDots}
            </motion.span>
          ) : generatedNotes ? (
            <span>{generatedNotes}</span>
          ) : (
            <span className="text-gray-400 italic">Upon generation, a preview of your notes will be visible here.</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
