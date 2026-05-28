use crate::domain::models::Project;

pub trait ProjectRepository: Send + Sync {
    fn list(&self) -> Result<Vec<Project>, String>;
    fn save(&self, project: &Project) -> Result<(), String>;
    fn update(&self, project: &Project) -> Result<(), String>;
    fn delete(&self, id: &str) -> Result<(), String>;
}
