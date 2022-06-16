var video = document.querySelector("video");

var assetURL1 = "http://127.0.0.1:5500/videos/1f.mp4 ";
var assetURL2 = "http://127.0.0.1:5500/videos/2f.mp4 ";
var assetURL3 = "http://127.0.0.1:5500/videos/3f.mp4 ";
var assetURL4 = "http://127.0.0.1:5500/videos/4f.mp4 ";
var assetURL5 = "http://127.0.0.1:5500/videos/5f.mp4 ";
var assetURL6 = "http://127.0.0.1:5500/videos/6f.mp4 ";
var assetURL7 = "http://127.0.0.1:5500/videos/7f.mp4 ";
var assetURL8 = "http://127.0.0.1:5500/videos/8f.mp4 ";
var assetURL9 = "http://127.0.0.1:5500/videos/9f.mp4 ";
var assetURL10 = "http://127.0.0.1:5500/videos/10f.mp4 ";
// var assetURL = "https://d1b2-113-23-76-238.ap.ngrok.io/videos/";
var assetURL = "http://127.0.0.1:5500/videos/";

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


  async function a(vids) {
    let i = 1;
    while (i <= vids) {
      
      await fetchSegment(assetURL + i + "f.mp4").then(async (buf) => {
        console.log("appending vid: " + i);
        await appendBufferAsync(sourceBuffer, buf);
      });

      if (i == vids) {
        mediaSource.endOfStream;
        break;
      }

      i++;
    }
  }

  a(10);

}

function fetchSegment(url) {
  console.log(url);

  return fetch(url).then((response) => {
    return response.arrayBuffer();
  });
}

function appendBufferAsync(sourceBuffer, arrayBuffer) {
  sourceBuffer.appendBuffer(arrayBuffer);

  return new Promise((resolve, reject) => {
    if (!sourceBuffer.updating) {
      resolve("!update");
      console.log("not updating");
    }

    sourceBuffer.onupdateend = () => {
      console.log("done updating");
      resolve("end");
    };
  });
}

