import apiCall from "./api_manager";

export default class RealTimeNoteManager{
    private notes:string[] = [];
    
    addTranscript(part: string) {
        this.notes.push(part);
    };

    clearTranscript() {
        this.notes = [];
    }

    getAll() {
        return this.notes.join("\n\n");
    };

    async Audio2Transcript(blob: Blob) {
        console.log('1 //... sending audio chunk: ', blob.size, ' bytes');
        const new_transcript = await apiCall(blob);
        
        console.log('3 //notes manager - recieved new note:', new_transcript);
       
        this.addTranscript(new_transcript.transcript);
        
    }



}