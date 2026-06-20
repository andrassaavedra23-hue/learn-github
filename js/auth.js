/**
 * LEARN GITHUB - SISTEMA DE AUTENTICACIÓN
 * Single Source of Truth (SSOT)
 * Autor: Andrés Saavedra
 */

const AUTH_KEY = 'learngithub_users';
const SESSION_KEY = 'learngithub_session';

/**
 * Obtener todos los usuarios del localStorage
 */
function getUsers() {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : {};
}

/**
 * Guardar usuarios en localStorage
 */
function saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

/**
 * Obtener sesión actual
 */
function getSession() {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Establecer sesión
 */
function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/**
 * Cerrar sesión
 */
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

/**
 * Registrar nuevo usuario
 */
function registerUser(name, email, password) {
    const users = getUsers();

    if (users[email]) {
        return { success: false, message: 'Ya existe una cuenta con este email' };
    }

    users[email] = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        xp: 0,
        completedModules: [],
        badges: [],
        lastModule: null,
        lastVisit: null,
        streak: 0
    };

    saveUsers(users);
    return { success: true, message: 'Cuenta creada exitosamente' };
}

/**
 * Iniciar sesión
 */
function loginUser(email, password) {
    const users = getUsers();
    const user = users[email];

    if (!user || user.password !== password) {
        return { success: false, message: 'Email o contraseña incorrectos' };
    }

    setSession({ email: email, name: user.name });
    return { success: true, message: 'Bienvenido, ' + user.name, user: user };
}

/**
 * Cerrar sesión y redirigir
 */
function logout() {
    clearSession();
    window.location.href = 'index.html';
}

/**
 * Verificar autenticación (redirige si no hay sesión)
 */
function requireAuth() {
    const session = getSession();
    if (!session) {
        window.location.href = 'index.html';
        return null;
    }
    return session;
}

/**
 * Obtener datos del usuario actual
 */
function getCurrentUser() {
    const session = getSession();
    if (!session) return null;

    const users = getUsers();
    return users[session.email] || null;
}

/**
 * Guardar datos del usuario actual
 */
function saveCurrentUser(userData) {
    const session = getSession();
    if (!session) return false;

    const users = getUsers();
    users[session.email] = userData;
    saveUsers(users);
    return true;
}

/**
 * Actualizar racha de días
 */
function updateStreak(user) {
    const today = new Date().toDateString();
    const lastVisit = user.lastVisit;

    if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
            user.streak = (user.streak || 0) + 1;
        } else if (!lastVisit) {
            user.streak = 1;
        } else {
            user.streak = 1;
        }
        user.lastVisit = today;
    }
    return user;
}

/**
 * Renderizar navbar con información del usuario
 */
function renderNavUser() {
    const session = getSession();
    if (!session) return;

    const navUser = document.getElementById('navUser');
    const navName = document.getElementById('navName');
    const navAvatar = document.getElementById('navAvatar');

    if (navUser) navUser.classList.remove('hidden');
    if (navName) navName.textContent = session.name;
    if (navAvatar) navAvatar.textContent = session.name.charAt(0).toUpperCase();
}

/**
 * Inicializar autenticación en página
 */
function initAuth() {
    const session = getSession();
    if (session) {
        renderNavUser();
        const user = getCurrentUser();
        if (user) {
            updateStreak(user);
            saveCurrentUser(user);
        }
    }
}