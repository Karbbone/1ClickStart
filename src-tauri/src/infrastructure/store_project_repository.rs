use crate::application::dto::ProjectDto;
use crate::domain::models::Project;
use crate::domain::ports::ProjectRepository;
use std::sync::Arc;
use tauri::Runtime;
use tauri_plugin_store::Store;

const PROJECTS_KEY: &str = "projects";

pub struct StoreProjectRepository<R: Runtime> {
    store: Arc<Store<R>>,
}

impl<R: Runtime> StoreProjectRepository<R> {
    pub fn new(store: Arc<Store<R>>) -> Self {
        Self { store }
    }
}

impl<R: Runtime> ProjectRepository for StoreProjectRepository<R> {
    fn list(&self) -> Result<Vec<Project>, String> {
        let projects: Vec<ProjectDto> = self
            .store
            .get(PROJECTS_KEY)
            .and_then(|v| serde_json::from_value(v).ok())
            .unwrap_or_default();
        Ok(projects.into_iter().map(Project::from).collect())
    }

    fn save(&self, project: &Project) -> Result<(), String> {
        let mut projects = self.list()?;
        projects.push(project.clone());
        let dtos: Vec<ProjectDto> = projects.into_iter().map(ProjectDto::from).collect();
        self.store.set(
            PROJECTS_KEY,
            serde_json::to_value(dtos).map_err(|e| e.to_string())?,
        );
        self.store.save().map_err(|e| e.to_string())?;
        Ok(())
    }
}
