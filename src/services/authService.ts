import { StudentUser, SkillLevel } from '../types/learning';

interface StoredStudentAccount {
  user: StudentUser;
  salt: string;
  passwordHash: string;
}

const ACCOUNTS_STORAGE_KEY = 'signaviva_accounts_real_v2';
const ACTIVE_SESSION_KEY = 'signaviva_active_session_real_v2';

async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}:signaviva_sec_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'ES';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function loadAccounts(): StoredStudentAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredStudentAccount[];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredStudentAccount[]): void {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export function getRegisteredStudents(): StudentUser[] {
  return loadAccounts().map((a) => a.user);
}

export function getActiveStudentSession(): StudentUser | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentUser;
  } catch {
    return null;
  }
}

export function setActiveStudentSession(user: StudentUser | null): void {
  if (!user) {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } else {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(user));
  }
}

export async function registerStudent(params: {
  name: string;
  email: string;
  password: string;
  dailyGoalMinutes: number;
  preferredLevel: SkillLevel;
}): Promise<{ user?: StudentUser; error?: string }> {
  const cleanName = params.name.trim();
  const cleanEmail = params.email.trim().toLowerCase();

  if (cleanName.length < 2) {
    return { error: 'Por favor, introduce un nombre válido (mínimo 2 caracteres).' };
  }
  if (!cleanEmail.includes('@') || cleanEmail.length < 5) {
    return { error: 'Por favor, introduce un correo electrónico válido.' };
  }
  if (params.password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres por seguridad.' };
  }

  const accounts = loadAccounts();
  if (accounts.some((a) => a.user.email.toLowerCase() === cleanEmail)) {
    return { error: 'Ya existe una cuenta registrada con este correo electrónico.' };
  }

  const salt = generateSalt();
  const passwordHash = await hashPasswordWithSalt(params.password, salt);

  const newUser: StudentUser = {
    id: `stu-${Date.now().toString(36)}`,
    name: cleanName,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    dailyGoalMinutes: params.dailyGoalMinutes || 15,
    preferredLevel: params.preferredLevel || 'inicial',
    avatarInitials: getInitials(cleanName)
  };

  accounts.push({ user: newUser, salt, passwordHash });
  saveAccounts(accounts);
  setActiveStudentSession(newUser);

  return { user: newUser };
}

export async function loginStudent(
  email: string,
  password: string
): Promise<{ user?: StudentUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = loadAccounts();
  const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

  if (!account) {
    return { error: 'No se encontró ningún estudiante registrado con ese correo electrónico.' };
  }

  const computedHash = await hashPasswordWithSalt(password, account.salt);
  if (computedHash !== account.passwordHash) {
    return { error: 'La contraseña introducida es incorrecta.' };
  }

  setActiveStudentSession(account.user);
  return { user: account.user };
}

export function updateStudentProfile(updatedUser: StudentUser): StudentUser {
  const accounts = loadAccounts();
  const idx = accounts.findIndex((a) => a.user.id === updatedUser.id);
  const normalized: StudentUser = {
    ...updatedUser,
    avatarInitials: getInitials(updatedUser.name)
  };
  if (idx >= 0) {
    accounts[idx].user = normalized;
    saveAccounts(accounts);
  }
  setActiveStudentSession(normalized);
  return normalized;
}
