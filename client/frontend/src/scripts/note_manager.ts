import ApiCalls from "./api_manager";

const callApi= new ApiCalls();

export default class RealTimeNoteManager{
    private notes:string[] = [];
    onUpdate: ((newNote: string) => void) | null = null;

    addTranscript(part: string) {
        this.notes.push(part);
        if (this.onUpdate) {
            this.onUpdate(part);
        }
    };

    clearTranscript() {
        this.notes = [];
    }

    getAll() {
        return this.notes.join("\n");
    };

    async Audio2Transcript(blob: Blob) {
        console.log('1 //... sending audio chunk: ', blob.size, ' bytes');
        const new_transcript = await callApi.audio_to_transcript(blob);
        
        console.log('3 //notes manager - recieved new note:', new_transcript);
       
        this.addTranscript(new_transcript.transcript);
        
    }

    async GenerateNotes(features :string[]){
        console.log('1 // sending transcripts to backend')
        const generated_notes = await callApi.transcripts_to_notes(features, this.getAll())

        return generated_notes.notes;
    }



}