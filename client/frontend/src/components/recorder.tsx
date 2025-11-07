import { useState, useRef } from "react";
import NoteManager from '../note_manager.ts';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const TranscriptionManager = new NoteManager;
  const [transcriptions, setTranscriptions] = useState<string | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        console.log("sending chunk: ",event.data.size, " bytes");
        if (event.data.size > 0) TranscriptionManager.sendAudioChunk(event.data);
        setTranscriptions(TranscriptionManager.getAll());

      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      recorder.start(7000); 
      setIsRecording(true);

    } catch (err) {
      console.error("Mic access failed:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      {!isRecording && <button onClick={startRecording}>Start Recording</button>}
      {isRecording && <button onClick={stopRecording}>Stop Recording</button>}

      {audioURL && (
        <audio controls src={audioURL}>
          Your browser does not support audio playback.
        </audio>
      )}
      {transcriptions}
    </div>
  );
}
