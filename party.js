const video = document.getElementById("partyVideo");

if (video) {
    video.addEventListener("loadedmetadata", () => {
        video.volume = 0.2; 
    });
}

const articleItems = document.querySelectorAll('.article-text');

if (articleItems.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target);     
            }
        });
    }, { threshold: 0.1 });

    articleItems.forEach(el => observer.observe(el));
}