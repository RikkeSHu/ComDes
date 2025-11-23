
//  MULTI-SLICE PIE CHART ----------------

document.addEventListener("DOMContentLoaded", () => {
    const multiCharts = document.querySelectorAll(".multi-pie-chart");
    if (!multiCharts.length) return;

    // Fallback: animer alle hvis IntersectionObserver ikke finnes
    if (!("IntersectionObserver" in window)) {
        multiCharts.forEach(chart => animateMultiSlicePie(chart));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    if (!el.dataset.animated) {
                        animateMultiSlicePie(el);
                        el.dataset.animated = "true";
                    }

                    observer.unobserve(el);
                }
            });
        },
        { threshold: 0.4 }
    );

    multiCharts.forEach(chart => observer.observe(chart));
});

function animateMultiSlicePie(container) {
    const values = container.dataset.values
        .split(",")
        .map(v => parseFloat(v.trim()));

    const size = 220;
    const radius = size / 2 - 15;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    let accumulatedPercent = 0;

    values.forEach((percent, index) => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", center);
        circle.setAttribute("cy", center);
        circle.setAttribute("r", radius);

        circle.classList.add(`slice-${index + 1}`);

        circle.style.fill = "none";
        circle.style.strokeWidth = 20;

        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        // Startvinkel for denne biten
        const rotation = (accumulatedPercent / 100) * 360;
        circle.style.transformOrigin = `${center}px ${center}px`;
        circle.style.transform = `rotate(${rotation - 90}deg)`;

        svg.appendChild(circle);

        // Animasjon for denne biten
        const duration = 1500;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);

            const offset = circumference - (percent / 100) * circumference * progress;
            circle.style.strokeDashoffset = offset;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);

        accumulatedPercent += percent;
    });

    // Midt-tekst
    const totalLabel = document.createElement("div");
    totalLabel.classList.add("multi-pie-percentage");
    totalLabel.textContent = "100%";

    container.innerHTML = "";
    container.appendChild(svg);
    container.appendChild(totalLabel);
}

// Skjærefjøl scroll-animasjon ----------

document.addEventListener("DOMContentLoaded", () => {
    const boards = document.querySelectorAll(".board-block");
    if (!boards.length) return;

    if (!("IntersectionObserver" in window)) {
        boards.forEach(b => b.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.25 }
    );

    boards.forEach(block => observer.observe(block));
});

// scroll-fade for .scroll-fade-elementer ----------

document.addEventListener("DOMContentLoaded", () => {
    const fadeEls = document.querySelectorAll(".scroll-fade");
    if (!fadeEls.length) return;

    // Fallback hvis IntersectionObserver ikke finnes
    if (!("IntersectionObserver" in window)) {
        fadeEls.forEach(el => el.classList.add("visible"));
        return;
    }

    const fadeObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
});
