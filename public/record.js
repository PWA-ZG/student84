function registerNotification(e) {
  Notification.requestPermission((permission) => {
    if (permission === "granted") {
      registerBackgroundSync();
    } else console.error("Permission was not granted.");
  });
}

function registerNotificationTwo(e) {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        registerBackgroundSyncTwo();
      } else console.error("Permission was not granted.");
    });
  }

function postSync() {
  let obj = { name: "Bruno" };
  this.http.post("/data", obj).subscribe(
    (res) => {
      console.log(res);
    },
    (err) => {
      this.registerBackgroundSync();
    }
  );
}
function registerBackgroundSync() {
  if (!navigator.serviceWorker) {
    return console.error("Service Worker not supported");
  }
  navigator.serviceWorker.ready
    .then((registration) => registration.sync.register("sync-two"))
    .then(() => console.log("Registered background sync"))
    .catch((err) =>
      console.error("Error registering background sync", err)
    );
}


function registerBackgroundSyncTwo() { //Dodano naknadno, u slučaju da ne radi, pobriši
    if (!navigator.serviceWorker) {
      return console.error("Service Worker not supported");
    }
    navigator.serviceWorker.ready
      .then((registration) => registration.sync.register("sync"))
      .then(() => console.log("Registered background sync"))
      .catch((err) =>
        console.error("Error registering background sync", err)
      );
  }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/SW.js", { type: "module" })
    .then((reg) => console.log("SW registered!", reg))
    .catch((err) => console.log("boo", err));
}

function getUserMedia(options, successCallback, failureCallback) {
  var api =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

var theStream;
var theRecorder;
var recordedChunks = [];

function getStream() {
  if (
    !navigator.getUserMedia &&
    !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia &&
    !navigator.msGetUserMedia
  ) {
    alert("User Media API not supported.");
    return;
  }

  var constraints = { video: true, audio: true };
  getUserMedia(
    constraints,
    function (stream) {
      var mediaControl = document.querySelector("video");

      if ("srcObject" in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (
          window.URL || window.webkitURL
        ).createObjectURL(stream);
      }

      theStream = stream;
      try {
        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        return;
      }
      theRecorder = recorder;
      console.log("MediaRecorder created");
      recorder.ondataavailable = recorderOnDataAvailable;
      recorder.start(100);
    },
    function (err) {
      alert("Error: " + err);
    }
  );
}

function recorderOnDataAvailable(event) {
  if (event.data.size == 0) return;
  recordedChunks.push(event.data);
}

function download() {
  console.log("Saving data");
  theRecorder.stop();
  theStream.getTracks()[0].stop();
  const videoNameForm = document.getElementById("videoName")
  const videoname = videoNameForm.value

  if(videoname === ""){
    alert("You need to enter a movie name if you want to download it!")
    return
  }

  var blob = new Blob(recordedChunks, { type: "video/webm" });
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = `${videoname}.webm` //"test.webm";
  a.click();

  // setTimeout() here is needed for Firefox.
  setTimeout(function () {
    (window.URL || window.webkitURL).revokeObjectURL(url);
  }, 100);

  registerNotificationTwo()
  //.reload()
}
