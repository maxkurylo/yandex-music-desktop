

class TrackInfoCollector {

    constructor() {
        this.baseUrl = 'https://music.yandex.ru';
        this.options = {
            headers: {
                'X-Retpath-Y': encodeURIComponent('https://music.yandex.ru/')
            },
            redirect: 'error',
            credentials: 'include'
        };
    }

    async getTrackInfo(trackId) {
        const trackSrcUrl = this.baseUrl + '/api/v2.1/handlers/track/' + trackId + '/track/download/m?hq=1';
        const trackSrc = await fetch(trackSrcUrl, this.options).then(resp => resp.json());

        const downloadData = await fetch(`${trackSrc.src}&format=json`).then(resp => resp.json());

        const hash = this.calculateHash(downloadData);

        const trackInfoUrl = `${this.baseUrl}/handlers/track.jsx?track=${trackId}`;
        let trackInfoJSON = await fetch(trackInfoUrl, this.options).then(resp => resp.json());

        const trackInfo = {
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

    calculateHash(downloadData) {
        //to be honest, it doesn't really matter what string to hash, it'll still work
        const salt = 'XGRlBW9FXlekgbPrRHuSiA';
        return window.md5(salt + downloadData.path.substr(1) + downloadData.s);
    }
}

function fetchBuffer(url, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.response) {
                    resolve(xhr.response);
                } else {
                    reject(new Error('Empty result'));
                }
            } else {
                reject(new Error(`${xhr.status} (${xhr.statusText})`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        if (onProgress) {
            xhr.onprogress = onProgress;
        }
        xhr.send();
    });
}

const infoCollector = new TrackInfoCollector();
let trackInfo = infoCollector.getTrackInfo("55590540");
trackInfo.then(arg => {
    const buffer = this.fetchBuffer(arg.cover);
    console.log(buffer);
    window.ipc.send('track-info', arg);
});