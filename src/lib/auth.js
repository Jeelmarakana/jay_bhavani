export const CLIENT_USERS_KEY = 'jay_bhavani_client_users';
export const CLIENT_SESSION_KEY = 'jay_bhavani_client_session';

const readStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export function getStoredUsers() {
  return readStorage(CLIENT_USERS_KEY, []);
}

export function saveStoredUsers(users) {
  writeStorage(CLIENT_USERS_KEY, users);
}

export function registerUser({ name, email, password }) {
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return { success: false, message: 'Please fill in all fields.' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return { success: false, message: 'This email is already registered.' };
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  return {
    success: true,
    message: 'Registration successful. You can now log in.',
    user: newUser,
  };
}

export function loginUser({ identifier, password }) {
  if (!identifier?.trim() || !password?.trim()) {
    return { success: false, message: 'Please enter your email and password.' };
  }

  const users = getStoredUsers();
  const lookupValue = identifier.trim().toLowerCase();
  const matchingUser = users.find(
    (user) => user.email === lookupValue || user.name.toLowerCase() === lookupValue,
  );

  if (!matchingUser || matchingUser.password !== password) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const sessionUser = {
    id: matchingUser.id,
    name: matchingUser.name,
    email: matchingUser.email,
  };

  writeStorage(CLIENT_SESSION_KEY, sessionUser);

  return {
    success: true,
    message: 'Login successful.',
    user: sessionUser,
  };
}

export function getClientSession() {
  return readStorage(CLIENT_SESSION_KEY, null);
}

export function clearClientSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CLIENT_SESSION_KEY);
}
