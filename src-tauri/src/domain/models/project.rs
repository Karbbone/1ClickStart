#[derive(Debug, Clone, PartialEq)]
pub enum ProjectAction {
    OpenBrowser {
        url: String,
    },
    RunTerminal {
        command: String,
        open_in_terminal: bool,
    },
    OpenTerminal,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub actions: Vec<ProjectAction>,
}

impl Project {
    pub fn new(name: String, path: String, actions: Vec<ProjectAction>) -> Self {
        let id = uuid_v4();
        Self {
            id,
            name,
            path,
            actions,
        }
    }
}

fn uuid_v4() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos();
    format!("{:x}", timestamp)
}
