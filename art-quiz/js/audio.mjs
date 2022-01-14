let audio = new Audio();

export function playAudio(url) {
  audio.src = url;
  audio.volume = localStorage.getItem('volume');
  audio.pause();
  audio.currentTime = 0;
  let nopromise = {
    catch: new Function(),
  };
  (audio.play() || nopromise).catch(function () {});
}
