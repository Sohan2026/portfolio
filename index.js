import { fetchGitHubData, fetchJSON, renderProjects } from './global.js';
async function loadGitHubProfile() {
  try {
    const githubData = await fetchGitHubData('Sohan2026');
    const profileStats = document.querySelector('#profile-stats');
    
    if (profileStats) {
        profileStats.innerHTML = `
          <h3>GitHub Profile Stats</h3>
          <dl style="display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 16px; align-items: center;">
            <dt style="text-align: center; font-weight: bold;">Followers</dt>
            <dd style="text-align: center; font-size: 1.5em;">${githubData.followers}</dd>
      
            <dt style="text-align: center; font-weight: bold;">Following</dt>
            <dd style="text-align: center; font-size: 1.5em;">${githubData.following}</dd>
      
            <dt style="text-align: center; font-weight: bold;">Public Repos</dt>
            <dd style="text-align: center; font-size: 1.5em;">${githubData.public_repos}</dd>
      
            <dt style="text-align: center; font-weight: bold;">Public Gists</dt>
            <dd style="text-align: center; font-size: 1.5em;">${githubData.public_gists}</dd>
          </dl>
        `;
      }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
  }
}

async function loadLatestProjects() {
  try {

    const projects = await fetchJSON('./lib/projects.json');

    const latestProjects = projects.slice(0, 3);
    
    const projectsContainer = document.querySelector('.projects');
    
    latestProjects.forEach(project => {
      renderProjects(project, projectsContainer, 'h2');
    });
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

loadGitHubProfile();
loadLatestProjects();
