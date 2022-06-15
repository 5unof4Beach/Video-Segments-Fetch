var video = document.querySelector("video");

var assetURL = "https://aeda-113-23-76-238.ap.ngrok.io/videos/1f.mp4 ";
var assetURL2 = "https://aeda-113-23-76-238.ap.ngrok.io/videos/2f.mp4 ";
var assetURL3 = "https://aeda-113-23-76-238.ap.ngrok.io/videos/7f.mp4 ";

// var assetURL = "http://127.0.0.1:5500/videos/1f.mp4 ";
// var assetURL2 = "http://127.0.0.1:5500/videos/2f.mp4 ";
// var assetURL3 = "http://127.0.0.1:5500/videos/7f.mp4 ";

var mimeCodec = 'video/mp4; codecs="avc1.640829, mp4a.40.2"';

var mediaSource = new MediaSource();
if ("MediaSource" in window && MediaSource.isTypeSupported(mimeCodec)) {
  console.log(mediaSource.readyState); // closed
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener("sourceopen", sourceOpen);
} else {
  console.error("Unsupported MIME type or codec: ", mimeCodec);
}

function sourceOpen() {
  console.log(this.readyState); // open
  var mediaSource = this;
  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  //Vì timestamp các segment giống nhau nên phải đổi mode = sequence;
  sourceBuffer.mode = "sequence";

  

  // console.log(fetchSegment(assetURL, sourceBuffer))
  fetchSegment(assetURL, sourceBuffer)
    .then((buf) => {
      sourceBuffer.appendBuffer(buf);
    })
    .then(() => {
      return fetchSegment(assetURL2, sourceBuffer);
    })
    .then((buf2) => {
      sourceBuffer.appendBuffer(buf2);
    })
    .then(() => {
      return fetchSegment(assetURL3, sourceBuffer);
    })
    .then((buf3) => {
      sourceBuffer.appendBuffer(buf3);
    })
}

function fetchSegment(url, sourceBuffer) {
  console.log(url);

  const loadBuffer = new Promise((resolve, reject) => {
    sourceBuffer.onupdateend = () => {
      console.log('done updating')
      resolve('end');
    };

    if(!sourceBuffer.updating){
      resolve('!update')
      console.log("not updating")
    }
  });

  console.log(loadBuffer);
  return loadBuffer.then(() => {
    return fetch(url).then((response) => {
      return response.arrayBuffer();
    });
  });
}
