document.addEventListener("DOMContentLoaded", () => {
    initMultiSliceCharts();
    initMediaBoxesScrollAnimation();
});


// Video volume setup
const video = document.getElementById("partyVideo");
if (video) {
    video.addEventListener("loadedmetadata", () => {
        video.volume = 0.2; 
    });
}

// Fade in article text when visible
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

// ------------------- Multi-slice Pie Charts -------------------
function initMultiSliceCharts() {
    const multiCharts = document.querySelectorAll(".multi-pie-chart");
    if (!multiCharts.length) return;

    // Build all charts
    multiCharts.forEach(buildMultiSlicePie);

    // Update chart fill on scroll
    function updateChartsOnScroll() {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const midScreen = viewportHeight / 2;

        multiCharts.forEach(chart => {
            const rect = chart.getBoundingClientRect();
            const chartCenter = rect.top + rect.height / 2;

            let progress = 0;

            // Fill chart as it approaches the middle of the screen
            if (chartCenter <= viewportHeight && chartCenter >= midScreen) {
                progress = 1 - (chartCenter - midScreen) / (viewportHeight - midScreen);
            } else if (chartCenter < midScreen) {
                progress = 1; // fully filled
            } else {
                progress = 0; // still above middle, empty
            }

            progress = Math.max(0, Math.min(1, progress)); // clamp 0..1
            setPieProgress(chart, progress);
        });
    }

    window.addEventListener("scroll", updateChartsOnScroll);
    window.addEventListener("resize", updateChartsOnScroll);

    updateChartsOnScroll();
}

// Build a single multi-slice pie chart
function buildMultiSlicePie(container) {
    const valuesAttr = container.dataset.values;
    if (!valuesAttr) return;

    const values = valuesAttr
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const size = 220;
    const radius = size / 2 - 15;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    let accumulatedPercent = 0;
    const slices = [];

    values.forEach((percent, index) => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", center);
        circle.setAttribute("cy", center);
        circle.setAttribute("r", radius);

        circle.classList.add(`slice-${index + 1}`);
        circle.style.fill = "none";
        circle.style.strokeWidth = 20;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference; // start empty
        circle.style.transformOrigin = `${center}px ${center}px`;
        circle.style.transform = `rotate(${(accumulatedPercent / 100) * 360 - 90}deg)`;
        circle.style.strokeLinecap = "butt";

        circle.dataset.percent = percent;
        circle.dataset.circumference = circumference;

        svg.appendChild(circle);
        slices.push(circle);

        accumulatedPercent += percent;
    });

    const totalLabel = document.createElement("div");
    totalLabel.classList.add("multi-pie-percentage");
    totalLabel.textContent = "100%";

    container.innerHTML = "";
    container.appendChild(svg);
    container.appendChild(totalLabel);

    container._slices = slices;
}

// Set progress for a chart (0 to 1)
function setPieProgress(container, progress) {
    const slices = container._slices || container.querySelectorAll("circle");

    slices.forEach(circle => {
        const percent = parseFloat(circle.dataset.percent || "0");
        const circumference = parseFloat(circle.dataset.circumference || "0");

        const filledRatio = (percent / 100) * progress;
        const offset = circumference * (1 - filledRatio);

        circle.style.strokeDashoffset = offset;
    });
}

// ------ POP + FADE-IN/OUT FOR .media-box -------------
function initMediaBoxesScrollAnimation() {
    const boxes = document.querySelectorAll(".media-box");
    if (!boxes.length) return;

    boxes.forEach(box => box.classList.add("media-animate"));

    if (!("IntersectionObserver" in window)) {
        boxes.forEach(box => box.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                } else {
                    entry.target.classList.remove("in-view");
                }
            });
        },
        { threshold: 0.25 }
    );

    boxes.forEach(box => observer.observe(box));
}
