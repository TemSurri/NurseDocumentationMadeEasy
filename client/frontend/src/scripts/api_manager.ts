import axiosInstance from '../api.ts'

export default class ApiCalls {

    async audio_to_transcript(blob:Blob){

        const formdata = new FormData();
        formdata.append(
            "audio", blob, "audio-recording"
        );

        try {
            console.log("sending audio file : ", blob.size, " bytes")
            const res = await axiosInstance.post('/upload-audio', formdata, {
                headers: {"Content-Type": "multipart/form-data"}
            } );

            console.log('2 //api manager - api call success:', res.data);
            return res.data;
        } catch (error) {
            console.log('2 //api manager -api call error:', error);
            return error;
        };
    }

    async transcripts_to_notes(features:string[], transcripts:string){

        try {
            console.log("sending with", features, " :")
            console.log(transcripts)

            const res = await axiosInstance.post('/generate-notes', {transcript: transcripts, features: features},
                { headers: { "Content-Type": "application/json" }}
            );

            console.log('2 //api manager - api call success:', res.data);
            return res.data;
        } catch (error) {
            console.log('2 //api manager -api call error:', error);
            return error;
        };
    }


}