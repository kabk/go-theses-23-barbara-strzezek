const footnoteStartTimes = [ 1, -1, 290, -1, -1, -1, -1, -1, -1, -1,
                            -1, 897, -1, -1, -1, -1, -1, -1, -1, -1,
                            -1, -1, 12, 12, 12, -1, -1, 12, -1, 12,
                            -1, 1763, 1787, 1788, -1, -1, -1, -1, 1856, 12,
                            -1, -1, 12, -1, 12, -1, -1, 12, -1, -1,
                            12, -1, -1, -1, 12, -1, -1, -1, -1, -1,
                            -1, -1, -1, 12, 12, 12, -1, 12, -1, -1,
                            -1, -1, 12, -1, -1, -1, 12, -1,       ];


import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playIconContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('audio-player-container');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const muteIconContainer = document.getElementById('mute-icon');
let playState = 'play';
let muteState = 'unmute';

const playAnimation = lottieWeb.loadAnimation({
  container: playIconContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Play Animation",
});

let playIcons = document.querySelector(".playBtn");

playAnimation.goToAndStop(14, true);

playIconContainer.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        playAnimation.playSegments([14, 27], true);
        requestAnimationFrame(whilePlaying);
        playState = 'pause';
        playIcons.src = "assets/images/stop.png";
    } else {
        audio.pause();
        playAnimation.playSegments([0, 14], true);
        cancelAnimationFrame(raf);
        playState = 'play';
        playIcons.src = "assets/images/play.png";
    }
});



const showRangeProgress = (rangeInput) => {
    if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});






/** Implementation of the functionality of the audio player */

const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');
const outputContainer = document.getElementById('volume-output');
let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);

}

const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);

    // console.log(audio.currentTime);

    //Highlight footnotes
    const footnotes = document.querySelectorAll( '.footnotes > span' );
    footnoteStartTimes.forEach( ( startTime, index ) => {
        const footnote = footnotes[ index ];
        if ( startTime != -1 ) {
          if ( audio.currentTime >= startTime ) {
              //console.log( footnote );
              footnote.classList.add( 'active' );
              // footnote.classList.remove( 'notActive' );
          } else {
              footnote.classList.remove( 'active' );
              // footnote.classList.add( 'notActive' );
          }
        }
    } );

    // const fn1 = document.querySelector("#fn1");
    // if (audio.currentTime > 5 && audio.currentTime < 10) {
    //     fn1.style.background = "lightgrey";
    // } else {
    //     fn1.style.background = "none";
    // }

    // const fn2 = document.querySelector("#fn2");
    // if (audio.currentTime > 12 && audio.currentTime < 15) {
    //     fn2.style.background = "lightgrey";
    // } else {
    //     fn2.style.background = "none";
    // }

}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('progress',displayBufferedAmount);

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
        cancelAnimationFrame(raf);
    }

});

seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
        requestAnimationFrame(whilePlaying);
    }

});

const scrollContainer = document.querySelector(".footnotes");

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});
