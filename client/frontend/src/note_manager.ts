import AxiosInstance from './api.ts';

export default class NoteManager{
    private notes:string[] = [];
    
    addTranscript(part: string) {
        this.notes.push(part);
    };

    getAll() {
        return this.notes.join(" ");
    };

    async sendAudioChunk(blob: Blob) {
        console.log('size of blob : ', blob.size, ' bytes')
        /* do api call that returns transribed nots of the 15 sec blob aka sound gile*/
         /* add notes to notes thing, ill do an example one for below so i dont forget */
        this.addTranscript('new string transcript');
    }



}