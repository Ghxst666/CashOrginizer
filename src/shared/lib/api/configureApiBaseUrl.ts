import { invoke } from "@tauri-apps/api/core"
import { setAuthBaseUrl } from "@/shared/service/auth"
import { setApiBaseUrl } from "@/shared/service/api"

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown
  }
}

export async function configureApiBaseUrl(): Promise<void> {
  if (!window.__TAURI_INTERNALS__) {
    return
  }

  const apiBaseUrl = await invoke<string>("get_api_base_url")

  setApiBaseUrl(apiBaseUrl)
  setAuthBaseUrl(apiBaseUrl)
}
