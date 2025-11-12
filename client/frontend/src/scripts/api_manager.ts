import axiosInstance from '../api.ts'


export default async function apiCall(blob:Blob){

    const formdata = new FormData();
    formdata.append(
        "audio", blob, "recording"
    );

    try {
        console.log("sending audio file : ", blob.size, " bytes")
        const res = await axiosInstance.post('/upload-audio', formdata, {
            headers: {"Content-Type": "multipart/form-data"}
        } );
        console.log('success', res.data);
        return res.data;
    } catch (error) {
        console.log('error', error);
        return error;
    };

    

}


