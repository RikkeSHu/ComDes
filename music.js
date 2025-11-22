
                let progress = document.getElementById('progress');
                let song = document.getElementById('song');
                let ctrlIcon = document.getElementById('ctrlIcon');

                song.onloadedmetadata =function() {
                    progress.max = song.duration;
                    progress.value = song.currentTime;
                }

                function playPause() {
                    if(ctrlIcon.classList.contains('fa-pause')){
                        song.pause();
                        ctrlIcon.classList.remove('fa-pause');
                        ctrlIcon.classList.add('fa-play');
                    }
                    else{
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

