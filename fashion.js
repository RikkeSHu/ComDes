const sections = document.querySelectorAll('.scroll-section');
const images = document.querySelectorAll('.scroll-image-left');
const texts = document.querySelectorAll('.scroll-text-right');

function revealElements() {
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if(sectionTop < triggerBottom) section.classList.add('active');
        else section.classList.remove('active');
    });

    images.forEach(img => {
        const imgTop = img.getBoundingClientRect().top;
        if(imgTop < triggerBottom) img.classList.add('active');
        else img.classList.remove('active');
    });

    texts.forEach(text => {
        const textTop = text.getBoundingClientRect().top;
        if(textTop < triggerBottom) text.classList.add('active');
        else text.classList.remove('active');
    });
}

window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);
