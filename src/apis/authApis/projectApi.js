import axios from 'axios';

const SAVE_PROJECT_URL = 'https://sova-admin.cyberxinfosolution.com/api/projects/save';

export async function saveProject({ projectName, projectData }) {
  try {
    const token = localStorage.getItem('sovaToken');
    const response = await axios.post(
      SAVE_PROJECT_URL,
      {
        projectName,
        projectData,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
}

export async function loadProjects() {
  try {
    const token = localStorage.getItem('sovaToken');
    const response = await axios.get(
      'https://sova-admin.cyberxinfosolution.com/api/projects/',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to load projects:', error);
    throw error;
  }
} 