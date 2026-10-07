export interface ClientUser {
  id: number;
  name: string;
  email: string;
}

interface StoredUser extends ClientUser {
  password: string;
  createdAt: string;
}

const USERS_KEY = 'jay_bhavani_client_users';
const SESSION_KEY = 'jay_bhavani_client_session';

function readUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) as StoredUser[] : [];
  } catch (error) {
    console.error('Unable to read locally stored client accounts.', error);
    return [];
  }
}

export function getClientSession(): ClientUser | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) as ClientUser : null;
  } catch (error) {
    console.error('Unable to read the client session.', error);
    return null;
  }
}

export function registerClient(name: string, email: string, password: string): { success: boolean; message: string } {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, message: 'Please fill in all fields.' };
  }
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    return { success: false, message: 'This email is already registered.' };
  }
  users.push({
    id: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'Registration successful. You can now log in.' };
}

export function loginClient(identifier: string, password: string): { success: boolean; message: string } {
  if (!identifier.trim() || !password.trim()) {
    return { success: false, message: 'Please enter your email and password.' };
  }
  const lookup = identifier.trim().toLowerCase();
  const user = readUsers().find((item) => item.email === lookup || item.name.toLowerCase() === lookup);
  if (!user || user.password !== password) {
    return { success: false, message: 'Invalid email or password.' };
  }
  const session: ClientUser = { id: user.id, name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, message: 'Login successful.' };
}

export function clearClientSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
