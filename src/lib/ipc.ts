import { invoke } from "@tauri-apps/api/core";
import type { VibeState } from "../stores/vibeStore";

export interface SessionMeta {
  id: string;
  average_vibe: string;
  dominant_state: VibeState;
  duration_ms: number;
  word_count: number;
  created_at: string;
}

export interface SessionMetadataInput {
  average_vibe: string;
  dominant_state: VibeState;
  duration_ms: number;
  word_count: number;
}

export async function saveSession(
  content: string,
  metadata: SessionMetadataInput,
): Promise<void> {
  await invoke("save_session", { content, metadata });
}

export async function loadSessionList(): Promise<SessionMeta[]> {
  return invoke("load_session_list");
}

export async function loadSessionContent(id: string): Promise<string> {
  return invoke("load_session_content", { id });
}

export async function deleteSession(id: string): Promise<void> {
  await invoke("delete_session", { id });
}

export async function hasVaultPassphrase(): Promise<boolean> {
  return invoke("has_vault_passphrase");
}

export async function setVaultPassphrase(passphrase: string): Promise<void> {
  await invoke("set_vault_passphrase", { passphrase });
}

export async function verifyVaultPassphrase(passphrase: string): Promise<boolean> {
  return invoke("verify_vault_passphrase", { passphrase });
}
