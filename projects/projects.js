import { fetchJSON, renderProjects } from '../global.js';

// Fetch project data from JSON
async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        // Get the projects container element
        const projectsContainer = document.querySelector('.projects');

        // Get the projects-title element and update it with the count
        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) {
            projectsTitle.textContent = `Projects (${projects.length})`; // Update the count
        }

        // If projects data is empty, display a placeholder message
        if (projects && projects.length > 0) {
            projects.forEach(project => {
                renderProjects(project, projectsContainer, 'h2');
            });
        } else {
            const placeholderMessage = document.createElement('p');
            placeholderMessage.textContent = 'No projects available.';
            projectsContainer.appendChild(placeholderMessage);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call the function to load projects when the page loads
loadProjects();
