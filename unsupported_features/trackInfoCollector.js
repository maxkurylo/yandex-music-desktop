
export default class TrackInfoCollector {

    constructor() {
        this.baseUrl = 'https://music.yandex.ru';
        this.fetchOptions = {
            headers: {
                'X-Retpath-Y': encodeURIComponent(this.baseUrl)
            },
            redirect: 'error',
            credentials: 'include'
        };

        this.crypto = require('crypto');

    }

    async getTrackInfo(trackId) {
        const trackSrc = await fetchTrackSrc(trackId);

        const downloadData = await fetchDownloadData(trackSrc);

        const hash = this.calculateHash(downloadData);

        let trackInfoJSON = await fetchTrackInfoJSON(trackId);

        const trackInfo = {
            id: trackId,
            url: `https://${downloadData.host}/get-mp3/${hash}/${downloadData.ts + downloadData.path}`,
            codec: trackSrc.codec,
            artist: trackInfoJSON.track.artists[0].name,
            title: trackInfoJSON.track.title,
            genre: trackInfoJSON.track.albums[0].genre,
            lyrics: '',
            label: trackInfoJSON.track.albums[0].labels[0].name,
            cover: 'https://' + trackInfoJSON.track.coverUri.split('%%')[0] + 'm1000x1000',
            album: trackInfoJSON.track.albums[0].title,
            albumArtist: trackInfoJSON.track.albums[0].artists[0].name,
        };

        if ('lyric' in trackInfoJSON)
            trackInfo.lyrics = trackInfoJSON.lyric[0].fullLyrics;

        return trackInfo;
    }

    async fetchTrackSrc(trackId) {
        const trackSrcUrl = this.baseUrl + '/api/v2.1/handlers/track/' + trackId + '/track/download/m?hq=1';
        return fetch(trackSrcUrl, this.options).then(resp => resp.json());
    }

    async fetchDownloadData(trackSrc) {
        return fetch(`${trackSrc.src}&format=json`).then(resp => resp.json());
    }

    calculateHash(downloadData) {
        //to be honest, it doesn't really matter what string to hash, it'll still work
        const salt = 'XGRlBW9FXlekgbPrRHuSiA';
        return this.md5(salt + downloadData.path.substr(1) + downloadData.s);
    }

    async fetchTrackInfoJSON(trackId) {
        const trackInfoUrl = `${this.baseUrl}/handlers/track.jsx?track=${trackId}`;
        return fetch(trackInfoUrl, this.options).then(resp => resp.json());
    }

    md5(str) {
        return this.crypto.createHash('md5').update(str).digest("hex")
    }
}