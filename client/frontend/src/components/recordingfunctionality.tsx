import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import RealTimeNoteManager from "../scripts/note_manager.ts";

type RecordingState = "not-recording" | "recording" | "paused" | "finished";
interface ChildProps {
  features: string[];
  recordState: string;
  setRecordState: React.Dispatch<React.SetStateAction<RecordingState>>;
}

export default function RecordingFunctionality({
  features,
  recordState,
  setRecordState,
}: ChildProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const TranscriptionManager = useRef(new RealTimeNoteManager()).current;

  useEffect(() => {
    TranscriptionManager.onUpdate = (newNote: string) => {
      setGeneratedNotes((prev) => prev + "\n" + newNote);
    };
  }, [TranscriptionManager]);

  const streamRef = useRef<MediaStream | null>(null);

  const [recordingDots, setRecordingDots] = useState<string>("");
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [generatedFinalNotes, setGeneratedFinalNotes] = useState<string | null>(null);



  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingDots, setGeneratingDots] = useState("");

  const handleFinish = () => {
    releaseStream();
    setRecordState("finished");
  };

  const shouldRecordRef = useRef(false);

  const startRecording = async () => {
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const stream = streamRef.current;
      shouldRecordRef.current = true;

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let mimeType = "audio/webm;codecs=opus";
      if (isSafari) mimeType = "audio/mp4";

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      }

      console.log("Using MIME:", mimeType);
      console.log(import.meta.env.VITE_BACKEND_URL);
      const startNewRecorder = () => {
        if (!shouldRecordRef.current) return;

        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;

        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          if (!shouldRecordRef.current) return;

          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: mimeType });

            if (blob.size > 30000) {
              console.log("Sending chunk to Whisper");
              TranscriptionManager.Audio2Transcript(blob);
            } else {
              console.log("Ignored tiny chunk");
            }
          }

          if (shouldRecordRef.current) {
            setTimeout(() => startNewRecorder(), 120);
          }
        };

        recorder.start();

        setTimeout(() => {
          if (recorder.state === "recording") recorder.stop();
        }, 5000);
      };

      startNewRecorder();
    } catch (err) {
      console.error("Mic access failed:", err);
      alert("Enable mic permissions.");
    }
  };

  const stopRecording = () => {
    shouldRecordRef.current = false;
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
  };

  const releaseStream = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    try {
      if (recorder.state !== "inactive") recorder.stop();
      recorder.stream.getTracks().forEach((track) => track.stop());
    } finally {
      mediaRecorderRef.current = null;
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (recordState === "recording") {
      startRecording();

      let i = 0;
      const interval = setInterval(() => {
        setRecordingDots(".".repeat((i % 3) + 1));
        i++;
      }, 450);

      return () => clearInterval(interval);
    } else {
      stopRecording();
      setRecordingDots("");
    }
  }, [recordState]);

  const handleRecordToggle = () => {
    if (recordState === "not-recording") setRecordState("recording");
    else if (recordState === "recording") setRecordState("paused");
    else if (recordState === "paused") setRecordState("recording");
  };

  const handleReset = () => {
    setRecordState("not-recording");
    setGeneratedNotes("");
    setGeneratedFinalNotes(null);
    setIsGenerating(false);
    TranscriptionManager.clearTranscript();
    streamRef.current = null;
  };

  const handleGenerateNotes = async () => {
    setIsGenerating(true); 
    setGeneratedFinalNotes(null);

    const notes = await TranscriptionManager.GenerateNotes(features);

    setGeneratedFinalNotes(notes);
    setIsGenerating(false); 
  };

  useEffect(() => {
    if (!isGenerating) return;

    let i = 0;
    const interval = setInterval(() => {
      setGeneratingDots(".".repeat((i % 3) + 1));
      i++;
    }, 450);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <>
   
      <motion.div
        layout
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex flex-wrap gap-3 justify-center mb-2"
      >
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
              className={`flex-1 min-w-[140px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white rounded-none ${
                recordState === "recording"
                  ? "bg-teal-500"
                  : recordState === "paused"
                  ? "bg-sky-500"
                  : "bg-sky-600"
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
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={handleFinish}
                className="flex-1 min-w-[120px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white bg-cyan-600 rounded-none"
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
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerateNotes}
              className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-white bg-sky-700 rounded-none"
            >
              Generate Notes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-gray-700 border border-gray-300 rounded-none"
            >
              Clear All
            </motion.button>
          </div>
        )}
      </AnimatePresence>

   
      <div className="mt-3 w-full bg-gray-50 border border-gray-200 shadow-inner p-4 text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words font-mono min-h-[120px]">

  
        {isGenerating && (
          <motion.span
            key="generating-status"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-sky-600 font-medium"
          >
            Generating{generatingDots}
          </motion.span>
        )}

        {!isGenerating && recordState === "recording" && (
          <motion.span
            key="recording-status"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-sky-600 font-medium"
          >
            Recording{recordingDots}
          </motion.span>
        )}

        {!isGenerating && generatedNotes && !generatedFinalNotes && (
          <div className="mb-2">{generatedNotes}</div>
        )}

        {!isGenerating && generatedFinalNotes && (
          <div className="mb-2">{generatedFinalNotes}</div>
        )}

        {!isGenerating && !generatedNotes && recordState !== "recording" && (
          <span className="text-gray-400 italic">
            Upon generation, a preview of your notes will be visible here.
          </span>
        )}
      </div>
    </>
  );
}
