use std::{
    io::{Read, Write},
    net::{TcpListener, TcpStream},
    sync::Mutex,
    time::{Duration, Instant},
};

use tauri::{Manager, State};
use tauri_plugin_shell::{process::CommandChild, ShellExt};

struct BackendState {
    api_base_url: String,
    child: Mutex<Option<CommandChild>>,
}

impl Drop for BackendState {
    fn drop(&mut self) {
        if let Ok(mut child) = self.child.lock() {
            if let Some(child) = child.take() {
                let _ = child.kill();
            }
        }
    }
}

#[tauri::command]
fn get_api_base_url(state: State<'_, BackendState>) -> String {
    state.api_base_url.clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let backend = start_backend(app)?;
            app.manage(backend);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_api_base_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn start_backend(app: &tauri::App) -> Result<BackendState, Box<dyn std::error::Error>> {
    let port = reserve_local_port()?;
    let api_base_url = format!("http://127.0.0.1:{port}");
    let data_dir = app.path().app_data_dir()?;
    let env_path = find_backend_env_path(app)?;

    std::fs::create_dir_all(&data_dir)?;

    if !env_path.is_file() {
        return Err(format!(
            "Файл конфигурации backend не найден: {}",
            env_path.display()
        )
        .into());
    }

    let data_dir = data_dir.to_string_lossy().to_string();
    let env_path = env_path.to_string_lossy().to_string();
    let port_arg = port.to_string();
    let sidecar = app.shell().sidecar("cashorg-backend")?.args([
        "--host",
        "127.0.0.1",
        "--port",
        &port_arg,
        "--data-dir",
        &data_dir,
        "--env-file",
        &env_path,
        "--log-level",
        "info",
    ]);

    let (mut rx, child) = sidecar.spawn()?;

    tauri::async_runtime::spawn(async move { while rx.recv().await.is_some() {} });

    wait_for_health(port, Duration::from_secs(45))?;
    wait_for_runtime(port)?;

    Ok(BackendState {
        api_base_url,
        child: Mutex::new(Some(child)),
    })
}

fn find_backend_env_path(
    app: &tauri::App,
) -> Result<std::path::PathBuf, Box<dyn std::error::Error>> {
    let bundled_env_path = app.path().resource_dir()?.join("binaries").join(".env");

    if bundled_env_path.is_file() {
        return Ok(bundled_env_path);
    }

    let development_env_path = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("binaries")
        .join(".env");

    if development_env_path.is_file() {
        return Ok(development_env_path);
    }

    Err(format!(
        "Файл конфигурации backend не найден: {}",
        bundled_env_path.display()
    )
    .into())
}

fn reserve_local_port() -> Result<u16, std::io::Error> {
    let listener = TcpListener::bind(("127.0.0.1", 0))?;
    Ok(listener.local_addr()?.port())
}

fn wait_for_health(port: u16, timeout: Duration) -> Result<(), Box<dyn std::error::Error>> {
    let started_at = Instant::now();

    while started_at.elapsed() < timeout {
        if health_check(port).unwrap_or(false) {
            return Ok(());
        }

        std::thread::sleep(Duration::from_millis(250));
    }

    Err(format!("backend did not become healthy on 127.0.0.1:{port}").into())
}

fn health_check(port: u16) -> Result<bool, std::io::Error> {
    endpoint_check(port, "/health")
}

fn wait_for_runtime(port: u16) -> Result<(), Box<dyn std::error::Error>> {
    if endpoint_check(port, "/runtime")? {
        return Ok(());
    }

    Err(format!("backend runtime check failed on 127.0.0.1:{port}").into())
}

fn endpoint_check(port: u16, path: &str) -> Result<bool, std::io::Error> {
    let mut stream = TcpStream::connect(("127.0.0.1", port))?;

    stream.set_read_timeout(Some(Duration::from_secs(2)))?;
    stream.set_write_timeout(Some(Duration::from_secs(2)))?;
    stream.write_all(
        format!("GET {path} HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\r\n")
            .as_bytes(),
    )?;

    let mut response = String::new();
    stream.read_to_string(&mut response)?;

    Ok(response.starts_with("HTTP/1.1 200") || response.starts_with("HTTP/1.0 200"))
}
