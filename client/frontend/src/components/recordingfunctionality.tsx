import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef} from "react";
import RealTimeNoteManager from '../note_manager.ts';

type RecordingState = "not-recording" | "recording" | "paused" | "finished";
interface ChildProps {
    features:string[];
    recordState:string;
    setRecordState: React.Dispatch<React.SetStateAction<RecordingState>>;
}

export default function RecordingFunctionality({features, recordState, setRecordState}:ChildProps) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const TranscriptionManager = useRef(new RealTimeNoteManager()).current;
    const [transcriptions, setTranscriptions] = useState<string>('')

    const streamRef = useRef<MediaStream | null>(null);


    const [recordingDots, setRecordingDots] = useState<string>("");
    const [generatedNotes, setGeneratedNotes] = useState<string>("");
    const handleFinish = () => { 
      releaseStream();
      setRecordState("finished");
    };

    const startRecording = async () => {
      try {
        let stream = streamRef.current;
        if (!stream) {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
        }
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          console.log("sending chunk: ",event.data.size, " bytes");
          if (event.data.size > 0) TranscriptionManager.sendAudioChunk(event.data);
          setTranscriptions(TranscriptionManager.getAll());

        };
        recorder.onstop = () => {

        };
        recorder.start(5000)
      } catch (err) {
        console.error("Mic access failed:", err);
      }
    };

    const stopRecording = () => {
      mediaRecorderRef.current?.stop();

    };
    const releaseStream = () => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return;

      try {

        if (recorder.state !== "inactive") recorder.stop();


        recorder.stream.getTracks().forEach(track => track.stop());
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
      streamRef.current = null;
    };


    const handleGenerateNotes = async () => {
      console.log('these were ur options', features);
      setGeneratedNotes(transcriptions);
    };

    return (
        <>
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
                className={`flex-1 min-w-[140px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white transition-all duration-150 rounded-none ${
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
                  className="flex-1 min-w-[120px] py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-none"
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
                className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-white bg-sky-700 hover:bg-sky-800 rounded-none shadow-sm transition-all duration-150"
              >
                Generate Notes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
                className="flex-1 min-w-[120px] py-3 text-sm sm:text-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-none transition-all duration-150"
              >
                Clear All
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        <div className="mt-3 w-full bg-gray-50 border border-gray-200 shadow-inner p-4 text-sm sm:text-base text-gray-700 rounded-none text-left whitespace-pre-wrap break-words font-mono tracking-wide min-h-[120px] leading-relaxed">
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
            <span className="text-gray-400 italic">
              Upon generation, a preview of your notes will be visible here.
            </span>
          )}
        </div>
        </>
        



    )

}