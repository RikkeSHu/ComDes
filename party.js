 const video = document.getElementById("partyVideo");

        video.addEventListener("loadedmetadata", () => {
            video.volume = 0.2; // 20% volume
        });


     const articleItems = document.querySelectorAll('.article-text');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // animate only once
                }
            });
        }, { threshold: 0.1 });

        articleItems.forEach(el => observer.observe(el));
