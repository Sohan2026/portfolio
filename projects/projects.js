import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let selectedIndex = -1;

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');
        
        if (projectsTitle) {
            projectsTitle.textContent = `Projects`;
        }

        let filteredProjects = projects;

        const searchInput = document.querySelector('.searchBar');
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            filteredProjects = projects.filter((project) => {
                let values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query);
            });
            renderFilteredProjects(filteredProjects, projectsContainer);
            renderPieChart(filteredProjects);  // Update pie chart and legend
        });

        if (projects && projects.length > 0) {
            renderFilteredProjects(filteredProjects, projectsContainer);
            renderPieChart(filteredProjects); // First render on page load
        } else {
            const placeholderMessage = document.createElement('p');
            placeholderMessage.textContent = 'No projects available.';
            projectsContainer.appendChild(placeholderMessage);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderFilteredProjects(filteredProjects, projectsContainer) {
    projectsContainer.innerHTML = ''; // Clear previous results
    filteredProjects.forEach(project => {
        renderProjects(project, projectsContainer, 'h2');
    });
}

function renderPieChart(projectsGiven) {
    const svg = d3.select("#projects-pie-plot");
    svg.selectAll('path').remove(); // Clear previous pie chart paths

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcData = sliceGenerator(data);

    const arcGenerator = d3.arc().outerRadius(radius).innerRadius(0);
    const arcs = arcData.map(d => arcGenerator(d));

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    svg.attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    arcs.forEach((arc, idx) => {
        g.append("path")
            .attr("d", arc)
            .attr("fill", colorScale(idx))
            .attr("class", idx === selectedIndex ? "selected" : "")
            .on("click", () => {
                selectedIndex = selectedIndex === idx ? -1 : idx; // Toggle selection
                updatePieChartAndLegend(svg, arcs, data, colorScale);
                filterProjectsByYear(projectsGiven, data[idx].label);  // Filter based on selected year
            });
    });

    let legend = d3.select('.legend');
    legend.selectAll('li').remove(); // Clear previous legend items

    data.forEach((d, idx) => {
        const li = legend.append('li')
            .attr('class', selectedIndex === idx ? 'selected' : '')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin', '5px 0');

        li.append('span')
            .style('background-color', colorScale(idx)) // Set background color as the pie slice color
            .style('width', '20px')
            .style('height', '20px')
            .style('border-radius', '50%')
            .style('margin-right', '10px');

        li.append('span')
            .html(`${d.label} <em>(${d.value})</em>`)
            .style('font-size', '14px')
            .style('color', '#333');
    });
}

function filterProjectsByYear(projectsGiven, selectedYear) {
    if (selectedIndex === -1) {
        // If no wedge is selected, render all projects
        renderFilteredProjects(projectsGiven, document.querySelector('.projects'));
    } else {
        // If a wedge is selected, filter projects based on the selected year
        const filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
        renderFilteredProjects(filteredProjects, document.querySelector('.projects'));
    }
}

function updatePieChartAndLegend(svg, arcs, data, colorScale) {
    svg.selectAll('path')
        .attr("class", (d, i) => i === selectedIndex ? "selected" : "");

    d3.select('.legend').selectAll('li')
        .attr('class', (d, i) => i === selectedIndex ? 'selected' : '');
}

document.addEventListener("DOMContentLoaded", loadProjects);
