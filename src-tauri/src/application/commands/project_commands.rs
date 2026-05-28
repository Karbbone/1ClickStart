use crate::application::dto::{CreateProjectRequest, ProjectDto, UpdateProjectRequest};
use crate::domain::models::{Project, ProjectAction};
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
    let actions: Vec<ProjectAction> = request
        .actions
        .into_iter()
        .map(ProjectAction::from)
        .collect();
    let project = Project::new(request.name, request.path, actions);
    let repo = repo.lock().map_err(|e| e.to_string())?;
    repo.save(&project)?;
    Ok(ProjectDto::from(project))
}

#[tauri::command]
pub fn update_project(
    request: UpdateProjectRequest,
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<ProjectDto, String> {
    let actions: Vec<ProjectAction> = request
        .actions
        .into_iter()
        .map(ProjectAction::from)
        .collect();
    let project = Project {
        id: request.id,
        name: request.name,
        path: request.path,
        actions,
    };
    let repo = repo.lock().map_err(|e| e.to_string())?;
    repo.update(&project)?;
    Ok(ProjectDto::from(project))
}

#[tauri::command]
pub fn delete_project(
    id: String,
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<(), String> {
    let repo = repo.lock().map_err(|e| e.to_string())?;
    repo.delete(&id)
}

#[tauri::command]
pub fn launch_project(
    id: String,
    repo: State<'_, Mutex<Box<dyn ProjectRepository>>>,
) -> Result<(), String> {
    let repo = repo.lock().map_err(|e| e.to_string())?;
    let projects = repo.list()?;
    let project = projects
        .into_iter()
        .find(|p| p.id == id)
        .ok_or_else(|| format!("Project {} not found", id))?;

    for action in &project.actions {
        match action {
            ProjectAction::OpenBrowser { url } => {
                open::that(url).map_err(|e| format!("Failed to open browser: {}", e))?;
            }
            ProjectAction::RunTerminal {
                command,
                open_in_terminal,
            } => {
                if *open_in_terminal {
                    spawn_in_terminal(command, &project.path)?;
                } else {
                    spawn_background(command, &project.path)?;
                }
            }
            ProjectAction::OpenTerminal => {
                open_terminal_at(&project.path)?;
            }
        }
    }

    Ok(())
}

fn open_terminal_at(cwd: &str) -> Result<(), String> {
    if cfg!(target_os = "windows") {
        std::process::Command::new("cmd")
            .args(["/K", &format!("cd /d {}", cwd)])
            .spawn()
            .map_err(|e| format!("Failed to open terminal: {}", e))?;
    } else if cfg!(target_os = "macos") {
        let script = format!("tell application \"Terminal\" to do script \"cd {}\"", cwd);
        std::process::Command::new("osascript")
            .args(["-e", &script])
            .spawn()
            .map_err(|e| format!("Failed to open terminal: {}", e))?;
    } else {
        let terminals = ["x-terminal-emulator", "gnome-terminal", "konsole", "xterm"];
        let mut launched = false;
        for term in &terminals {
            let result = if *term == "gnome-terminal" {
                std::process::Command::new(term)
                    .arg("--working-directory")
                    .arg(cwd)
                    .spawn()
            } else {
                std::process::Command::new(term).current_dir(cwd).spawn()
            };
            if result.is_ok() {
                launched = true;
                break;
            }
        }
        if !launched {
            return Err("No terminal emulator found".to_string());
        }
    }
    Ok(())
}

fn spawn_background(command: &str, cwd: &str) -> Result<(), String> {
    let shell = default_shell();
    let (shell_cmd, flag) = shell_exec_flag(&shell);
    std::process::Command::new(shell_cmd)
        .arg(flag)
        .arg(command)
        .current_dir(cwd)
        .spawn()
        .map_err(|e| format!("Failed to run command: {}", e))?;
    Ok(())
}

fn spawn_in_terminal(command: &str, cwd: &str) -> Result<(), String> {
    if cfg!(target_os = "windows") {
        // cmd /K keeps the window open after the command runs
        std::process::Command::new("cmd")
            .args(["/K", command])
            .current_dir(cwd)
            .spawn()
            .map_err(|e| format!("Failed to open terminal: {}", e))?;
    } else if cfg!(target_os = "macos") {
        // osascript opens Terminal.app with the command
        let script = format!(
            "tell application \"Terminal\" to do script \"cd {} && {}\"",
            cwd, command
        );
        std::process::Command::new("osascript")
            .args(["-e", &script])
            .spawn()
            .map_err(|e| format!("Failed to open terminal: {}", e))?;
    } else {
        // Linux: try common terminal emulators
        let terminals = ["x-terminal-emulator", "gnome-terminal", "konsole", "xterm"];
        let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/sh".to_string());
        let full_command = format!("cd {} && {}", cwd, command);
        let mut launched = false;
        for term in &terminals {
            let result = if *term == "gnome-terminal" {
                std::process::Command::new(term)
                    .args(["--", &shell, "-c", &full_command])
                    .spawn()
            } else {
                std::process::Command::new(term)
                    .args(["-e", &format!("{} -c '{}'", shell, full_command)])
                    .spawn()
            };
            if result.is_ok() {
                launched = true;
                break;
            }
        }
        if !launched {
            return Err("No terminal emulator found".to_string());
        }
    }
    Ok(())
}

fn default_shell() -> String {
    if cfg!(target_os = "windows") {
        "cmd".to_string()
    } else {
        std::env::var("SHELL").unwrap_or_else(|_| "/bin/sh".to_string())
    }
}

fn shell_exec_flag(shell: &str) -> (&str, &str) {
    if shell.contains("cmd") {
        ("cmd", "/C")
    } else {
        (shell, "-c")
    }
}
