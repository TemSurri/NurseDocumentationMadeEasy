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
        return this.notes.join(" ");
    };

    async Audio2Transcript(blob: Blob) {
        console.log('size of blob : ', blob.size, ' bytes')
        const new_transcript = await apiCall(blob);
        
        console.log('adding to notes - recieved:', new_transcript)
        this.addTranscript('new_transcript');
    }



}