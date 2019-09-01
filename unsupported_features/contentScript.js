import TrackInfoCollector from './trackInfoCollector';
import ContentMessages from './contentMessages';

export default class ContentScript {
    constructor() {
        this.trackInfoCollector = new TrackInfoCollector();
        this.contentMessages = new ContentMessages();
    }

    cacheTrack(trackId) {
        const infoPromise = this.trackInfoCollector.getTrackInfo(trackId);
        infoPromise.then(trackInfo => this.contentMessages.sendTrackInfo(trackInfo));
    }

    getTrackInfo(trackId) {
        
    }

    downloadTrack(trackUrl) {
        let a = document.createElement('a');
        a.setAttribute('href', trackUrl);
        a.setAttribute('download', 'download.mp3');
        a.click();
    }
}
