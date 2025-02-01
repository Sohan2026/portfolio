import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');


        const projectsContainer = document.querySelector('.projects');


        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) {
            projectsTitle.textContent = `Projects (${projects.length})`;
        }

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

loadProjects();
