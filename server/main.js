class transcriber{
    constructor(api_key){
        this.api_key = api_key;
        this.segments = [];
    }

    transribe_segment(segment){
        if (segment.length > 10){
            console.log('segment too large')
            return;
        }
        console.log('transcribe small segment')
        this.segments.push('seg')
    }

    

}