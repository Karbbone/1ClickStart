use crate::application::dto::{CreateProjectRequest, ProjectDto};
use crate::domain::models::Project;
use crate::domain::ports::ProjectRepository;
use std::sync::Mutex;
use tauri::State;

#[tauri::command]
pub fn list_projects(
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<Vec<ProjectDto>, String> {
    let repo = repo.lock().map_err(|e| e.to_string())?;
    let projects = repo.list()?;
    Ok(projects.into_iter().map(ProjectDto::from).collect())
}

#[tauri::command]
pub fn create_project(
    request: CreateProjectRequest,
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<ProjectDto, String> {
    let project = Project::new(request.name, request.path);
    let repo = repo.lock().map_err(|e| e.to_string())?;
    repo.save(&project)?;
    Ok(ProjectDto::from(project))
}
