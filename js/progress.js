/**
 * LEARN GITHUB - SISTEMA DE PROGRESO
 * Single Source of Truth (SSOT)
 * Autor: Andrés Saavedra
 */

/**
 * Configuración de módulos
 */
const MODULES = [
    { id: 'intro', emoji: '🎯', title: '¿Qué es Git?', desc: 'Entiende la diferencia entre Git y GitHub', xp: 50, file: 'module-01-intro.html' },
    { id: 'flow', emoji: '🔄', title: 'El Flujo de Git', desc: 'Working → Staging → Repository', xp: 50, file: 'module-02-flow.html' },
    { id: 'terminal', emoji: '💻', title: 'Tu Primera Terminal', desc: 'Practica comandos reales de Git', xp: 50, file: 'module-03-terminal.html' },
    { id: 'commits', emoji: '📸', title: 'Commits en Acción', desc: 'Aprende a hacer commits efectivos', xp: 50, file: 'module-04-commits.html' },
    { id: 'branches', emoji: '🌿', title: 'Branches', desc: 'Líneas de desarrollo paralelas', xp: 50, file: 'module-05-branches.html' },
    { id: 'github', emoji: '☁️', title: 'GitHub & Push', desc: 'Sube tu código a la nube', xp: 50, file: 'module-06-github.html' },
    { id: 'quiz', emoji: '🏆', title: 'Quiz Final', desc: 'Demuestra lo que aprendiste', xp: 100, file: 'module-07-quiz.html' }
];

/**
 * Configuración de niveles
 */
const LEVELS = [
    { level: 1, name: 'Novato', xp: 0 },
    { level: 2, name: 'Aprendiz', xp: 100 },
    { level: 3, name: 'Practicante', xp: 250 },
    { level: 4, name: 'Intermedio', xp: 450 },
    { level: 5, name: 'Avanzado', xp: 700 },
    { level: 6, name: 'Experto', xp: 1000 },
    { level: 7, name: 'Git Master', xp: 1500 }
];

/**
 * Configuración de badges
 */
const BADGES = [
    { id: 'first_step', icon: '🎯', name: 'Primer paso', desc: 'Completa tu primer módulo', check: u => u.completedModules && u.completedModules.length >= 1 },
    { id: 'commander', icon: '💻', name: 'Comandante', desc: 'Usa la terminal interactiva', check: u => u.completedModules && u.completedModules.includes('terminal') },
    { id: 'photographer', icon: '📸', name: 'Fotógrafo', desc: 'Completa el módulo de commits', check: u => u.completedModules && u.completedModules.includes('commits') },
    { id: 'brancher', icon: '', name: 'Ramificador', desc: 'Domina los branches', check: u => u.completedModules && u.completedModules.includes('branches') },
    { id: 'cloud', icon: '☁️', name: 'Nube', desc: 'Sube código a GitHub', check: u => u.completedModules && u.completedModules.includes('github') },
    { id: 'graduate', icon: '🏆', name: 'Graduado', desc: 'Completa el quiz final', check: u => u.completedModules && u.completedModules.includes('quiz') },
    { id: 'master', icon: '👑', name: 'Git Master', desc: 'Completa todos los módulos', check: u => u.completedModules && u.completedModules.length >= 7 },
    { id: 'streak', icon: '🔥', name: 'En racha', desc: '3 días seguidos de práctica', check: u => u.streak >= 3 }
];

/**
 * Obtener nivel actual basado en XP
 */
function getLevel(xp) {
    let current = LEVELS[0];
    let next = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].xp) {
            current = LEVELS[i];
            next = LEVELS[i + 1] || { xp: LEVELS[i].xp + 500, name: 'Max' };
        }
    }

    const progress = xp - current.xp;
    const needed = next.xp - current.xp;
    const pct = Math.min(100, (progress / needed) * 100);

    return { current, next, progress, needed, pct };
}

/**
 * Completar módulo
 */
function completeModule(moduleId, xpEarned) {
    const session = getSession();
    if (!session) return false;

    const users = getUsers();
    const user = users[session.email];

    if (!user) return false;

    user.xp = (user.xp || 0) + xpEarned;
    if (!user.completedModules) user.completedModules = [];

    if (!user.completedModules.includes(moduleId)) {
        user.completedModules.push(moduleId);
    }

    user.lastModule = moduleId;
    users[session.email] = user;
    saveUsers(users);

    return true;
}

/**
 * Agregar XP al usuario
 */
function addXP(amount) {
    const session = getSession();
    if (!session) return 0;

    const users = getUsers();
    const user = users[session.email];

    if (!user) return 0;

    user.xp = (user.xp || 0) + amount;
    users[session.email] = user;
    saveUsers(users);

    return user.xp;
}

/**
 * Obtener estadísticas del usuario
 */
function getUserStats() {
    const user = getCurrentUser();
    if (!user) return null;

    const completed = user.completedModules || [];
    const unlockedBadges = BADGES.filter(b => b.check(user)).length;
    const levelInfo = getLevel(user.xp || 0);

    return {
        xp: user.xp || 0,
        level: levelInfo.current.level,
        levelName: levelInfo.current.name,
        completedModules: completed.length,
        totalModules: MODULES.length,
        unlockedBadges: unlockedBadges,
        totalBadges: BADGES.length,
        streak: user.streak || 0,
        lastModule: user.lastModule,
        progressPercent: Math.round((completed.length / MODULES.length) * 100)
    };
}

/**
 * Renderizar barra de progreso
 */
function renderProgressBar(progressPercent) {
    const progressFill = document.getElementById('moduleProgress');
    const progressText = document.getElementById('progressText');

    if (progressFill) progressFill.style.width = progressPercent + '%';
    if (progressText) progressText.textContent = progressPercent + '%';
}

/**
 * Renderizar estadísticas en dashboard
 */
function renderDashboardStats() {
    const stats = getUserStats();
    if (!stats) return;

    const elements = {
        xp: document.getElementById('statXP'),
        modules: document.getElementById('statModules'),
        badges: document.getElementById('statBadges'),
        streak: document.getElementById('statStreak'),
        levelBadge: document.getElementById('levelBadge'),
        levelProgress: document.getElementById('levelProgress'),
        levelFill: document.getElementById('levelFill')
    };

    if (elements.xp) elements.xp.textContent = stats.xp;
    if (elements.modules) elements.modules.textContent = stats.completedModules + '/' + stats.totalModules;
    if (elements.badges) elements.badges.textContent = stats.unlockedBadges + '/' + stats.totalBadges;
    if (elements.streak) elements.streak.textContent = stats.streak;
    if (elements.levelBadge) elements.levelBadge.textContent = 'Nivel ' + stats.level + ' · ' + stats.levelName;

    const levelInfo = getLevel(stats.xp);
    if (elements.levelProgress) {
        elements.levelProgress.textContent = stats.xp + ' / ' + levelInfo.next.xp + ' XP';
    }
    if (elements.levelFill) {
        elements.levelFill.style.width = levelInfo.pct + '%';
    }
}