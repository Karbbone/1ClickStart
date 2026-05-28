use crate::domain::models::{Project, ProjectAction};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "type")]
pub enum ProjectActionDto {
    #[serde(rename = "open_browser")]
    OpenBrowser { url: String },
    #[serde(rename = "run_terminal")]
    RunTerminal {
        command: String,
        open_in_terminal: bool,
    },
    #[serde(rename = "open_terminal")]
    OpenTerminal,
}

impl From<ProjectAction> for ProjectActionDto {
    fn from(a: ProjectAction) -> Self {
        match a {
            ProjectAction::OpenBrowser { url } => ProjectActionDto::OpenBrowser { url },
            ProjectAction::RunTerminal {
                command,
                open_in_terminal,
            } => ProjectActionDto::RunTerminal {
                command,
                open_in_terminal,
            },
            ProjectAction::OpenTerminal => ProjectActionDto::OpenTerminal,
        }
    }
}

impl From<ProjectActionDto> for ProjectAction {
    fn from(dto: ProjectActionDto) -> Self {
        match dto {
            ProjectActionDto::OpenBrowser { url } => ProjectAction::OpenBrowser { url },
            ProjectActionDto::RunTerminal {
                command,
                open_in_terminal,
            } => ProjectAction::RunTerminal {
                command,
                open_in_terminal,
            },
            ProjectActionDto::OpenTerminal => ProjectAction::OpenTerminal,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectDto {
    pub id: String,
    pub name: String,
    pub path: String,
    pub actions: Vec<ProjectActionDto>,
}

impl From<Project> for ProjectDto {
    fn from(p: Project) -> Self {
        Self {
            id: p.id,
            name: p.name,
            path: p.path,
            actions: p.actions.into_iter().map(ProjectActionDto::from).collect(),
        }
    }
}

impl From<ProjectDto> for Project {
    fn from(dto: ProjectDto) -> Self {
        Self {
            id: dto.id,
            name: dto.name,
            path: dto.path,
            actions: dto.actions.into_iter().map(ProjectAction::from).collect(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub path: String,
    pub actions: Vec<ProjectActionDto>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProjectRequest {
    pub id: String,
    pub name: String,
    pub path: String,
    pub actions: Vec<ProjectActionDto>,
}
