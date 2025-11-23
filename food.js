document.addEventListener("DOMContentLoaded", () => {
    initMultiSliceCharts();
    initBarCharts();
    initBoardBlocks();
    initScrollFade();
});

/* ------------------ 1) PIE CHART: SCROLL-STYRT ANIMASJON ------------------ */

function initMultiSliceCharts() {
    const multiCharts = document.querySelectorAll(".multi-pie-chart");
    if (!multiCharts.length) return;

    multiCharts.forEach(buildMultiSlicePie);

    function updateChartsOnScroll() {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const mid = viewportHeight / 2; 
        multiCharts.forEach(chart => {
            const rect = chart.getBoundingClientRect();
            const center = rect.top + rect.height / 2; 

            let progress = 0;


            if (center >= mid && center <= viewportHeight) {
                const range = viewportHeight - mid;
                const distFromMid = center - mid;
                progress = 1 - distFromMid / range;
            }

            else if (center >= 0 && center < mid) {
                const range = mid;    
                const distFromTop = center;  
                progress = distFromTop / range;
            } else {

                progress = 0;
            }


            progress = Math.max(0, Math.min(1, progress));

            setPieProgress(chart, progress);
        });
    }

    window.addEventListener("scroll", updateChartsOnScroll);
    window.addEventListener("resize", updateChartsOnScroll);


    updateChartsOnScroll();
}

function buildMultiSlicePie(container) {
    const valuesAttr = container.dataset.values;
    if (!valuesAttr) return;

    const values = valuesAttr
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const size = 220;
    const radius = size / 2 - 15;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

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

        // tom sirkel ved start
        circle.style.strokeDasharray = String(circumference);
        circle.style.strokeDashoffset = String(circumference);


        const rotation = (accumulatedPercent / 100) * 360;
        circle.style.transformOrigin = `${center}px ${center}px`;
        circle.style.transform = `rotate(${rotation - 90}deg)`;

        circle.dataset.percent = String(percent);
        circle.dataset.circumference = String(circumference);

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

    container.dataset.progress = "0";
    container._slices = slices;
}

function setPieProgress(container, progress) {
    container.dataset.progress = progress.toFixed(3);
    const slices = container._slices || container.querySelectorAll("circle");

    slices.forEach(circle => {
        const percent = parseFloat(circle.dataset.percent || "0");
        const circumference = parseFloat(circle.dataset.circumference || "0");

        // Hvor mye av denne biten som skal tegnes basert på global progress
        const filledRatio = (percent / 100) * progress;
        const offset = circumference * (1 - filledRatio);

        circle.style.strokeDashoffset = String(offset);
    });
}

/* ------------------ 1b) HORISONTALT BAR CHART ------------------ */

function initBarCharts() {
    const barCharts = document.querySelectorAll(".bar-chart");
    if (!barCharts.length) return;

    barCharts.forEach(buildBarChart);

    function updateBarsOnScroll() {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const mid = viewportHeight / 2;

        barCharts.forEach(chart => {
            const rect = chart.getBoundingClientRect();
            const center = rect.top + rect.height / 2;

            let progress = 0;

            if (center >= mid && center <= viewportHeight) {
                const range = viewportHeight - mid;
                const distFromMid = center - mid;
                progress = 1 - distFromMid / range;
            } else if (center >= 0 && center < mid) {
                const range = mid;
                const distFromTop = center;
                progress = distFromTop / range;
            } else {
                progress = 0;
            }

            progress = Math.max(0, Math.min(1, progress));
            setBarProgress(chart, progress);
        });
    }

    window.addEventListener("scroll", updateBarsOnScroll);
    window.addEventListener("resize", updateBarsOnScroll);
    updateBarsOnScroll();
}

function buildBarChart(container) {
    const valuesAttr = container.dataset.values || "";
    const labelsAttr = container.dataset.labels || "";

    const values = valuesAttr
        .split(",")
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

    const labels = labelsAttr
        .split(",")
        .map(l => l.trim());

    if (!values.length) return;

    const maxValue = Math.max(...values, 1);
    const bars = [];

    container.innerHTML = "";

    values.forEach((value, index) => {
        const row = document.createElement("div");
        row.className = "bar-row";

        const labelSpan = document.createElement("span");
        labelSpan.className = "bar-label";
        labelSpan.textContent = labels[index] || "";

        const track = document.createElement("div");
        track.className = "bar-track";

        const fill = document.createElement("div");
        fill.className = `bar-fill bar-fill-${index + 1}`;
        fill.dataset.value = String(value);
        fill.dataset.maxValue = String(maxValue);
        fill.style.width = "0%";

        const percentSpan = document.createElement("span");
        percentSpan.className = "bar-percent";
        percentSpan.textContent = `${value.toFixed(1)}%`;

        track.appendChild(fill);
        row.appendChild(labelSpan);
        row.appendChild(track);
        row.appendChild(percentSpan);

        container.appendChild(row);
        bars.push(fill);
    });

    container._bars = bars;
}

function setBarProgress(container, progress) {
    const bars = container._bars || container.querySelectorAll(".bar-fill");

    bars.forEach(fill => {
        const value = parseFloat(fill.dataset.value || "0");
        const max = parseFloat(fill.dataset.maxValue || "1");
        const targetWidth = (value / max) * 100 * progress;
        fill.style.width = `${targetWidth}%`;
    });
}


/* ------------------ 2) Skjærefjøl scroll-animasjon ------------------ */

function initBoardBlocks() {
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
}

/* ------------------ 3) scroll-fade for .scroll-fade-elementer ------------------ */

function initScrollFade() {
    const fadeEls = document.querySelectorAll(".scroll-fade");
    if (!fadeEls.length) return;

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
}
