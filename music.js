// --- RADIN-SPILLER ---

let progress = document.getElementById('progress');
let song = document.getElementById('song');
let ctrlIcon = document.getElementById('ctrlIcon');

if (song && progress && ctrlIcon) {
    song.onloadedmetadata = function() {
        progress.max = song.duration;
        progress.value = song.currentTime;
    }

    function playPause() {
        if (ctrlIcon.classList.contains('fa-pause')) {
            song.pause();
            ctrlIcon.classList.remove('fa-pause');
            ctrlIcon.classList.add('fa-play');
        } else {
            song.play();
            ctrlIcon.classList.add('fa-pause');
            ctrlIcon.classList.remove('fa-play');
        }
    }

    song.addEventListener("timeupdate", () => {
        progress.value = song.currentTime;
    });

    progress.onchange = function() {
        song.play();
        song.currentTime = progress.value;
        ctrlIcon.classList.add('fa-pause');
        ctrlIcon.classList.remove('fa-play');
    }
}


// --- XHEVRIJE-SPILLER ---

let progress2 = document.getElementById('progress2');
let song2 = document.getElementById('song2');
let ctrlIcon2 = document.getElementById('ctrlIcon2');

if (song2 && progress2 && ctrlIcon2) {
    song2.onloadedmetadata = function() {
        progress2.max = song2.duration;
        progress2.value = song2.currentTime;
    }

    function playPause2() {
        if (ctrlIcon2.classList.contains('fa-pause')) {
            song2.pause();
            ctrlIcon2.classList.remove('fa-pause');
            ctrlIcon2.classList.add('fa-play');
        } else {
            song2.play();
            ctrlIcon2.classList.add('fa-pause');
            ctrlIcon2.classList.remove('fa-play');
        }
    }

    song2.addEventListener("timeupdate", () => {
        progress2.value = song2.currentTime;
    });

    progress2.onchange = function() {
        song2.play();
        song2.currentTime = progress2.value;
        ctrlIcon2.classList.add('fa-pause');
        ctrlIcon2.classList.remove('fa-play');
    }
}


// --- SCROLLYTELLING: FADE-IN OG FADE-OUT PÅ ELEMENTER MED .fade ---

const fadeElements = document.querySelectorAll('.fade');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');   // fader inn
        } else {
            entry.target.classList.remove('show'); // fader ut
        }
    });
}, {
    threshold: 0.15 // hvor mye av elementet som må være synlig før det trigges
});

fadeElements.forEach((el) => observer.observe(el));

// --- TELEFON-SKJERM ANIMASJON PÅ SCROLL ---

const phoneWrappers = document.querySelectorAll('.phone-wrapper');

const phoneObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('screen-animate');
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

phoneWrappers.forEach((el) => phoneObserver.observe(el));

