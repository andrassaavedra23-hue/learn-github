/**
 * LEARN GITHUB - FUNCIONES COMUNES
 * Single Source of Truth (SSOT)
 * Autor: Andrés Saavedra
 */

/**
 * Mostrar notificación
 */
function showNotification(icon, text, isError = false) {
    const notification = document.getElementById('notification');
    const notifText = document.getElementById('notifText');
    const notifIcon = document.getElementById('notifIcon');

    if (!notification) return;

    if (notifIcon) notifIcon.textContent = icon;
    if (notifText) notifText.textContent = text;

    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

/**
 * Responder quiz
 */
function answerQuiz(quizId, element, isCorrect, xpAmount = 15) {
    const quiz = document.getElementById(quizId);
    if (!quiz || quiz.dataset.answered) return;

    quiz.dataset.answered = 'true';

    const options = quiz.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    if (isCorrect) {
        element.classList.add('correct');
        addXP(xpAmount);
        showNotification('⭐', '+' + xpAmount + ' XP - Quiz correcto');
    } else {
        element.classList.add('wrong');
        showNotification('❌', 'Incorrecto');
    }

    const feedback = document.getElementById(quizId + '-feedback');
    if (feedback) {
        feedback.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'wrong');
        feedback.innerHTML = isCorrect
            ? '✅ ¡Correcto! +' + xpAmount + ' XP'
            : '❌ Incorrecto. La respuesta correcta está marcada en verde.';
    }
}

/**
 * Cargar fuentes externas (Google Fonts)
 */
function loadFonts() {
    const interLink = document.createElement('link');
    interLink.rel = 'stylesheet';
    interLink.href = 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.css';
    document.head.appendChild(interLink);

    const jetbrainsLink = document.createElement('link');
    jetbrainsLink.rel = 'stylesheet';
    jetbrainsLink.href = 'https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.0/index.css';
    document.head.appendChild(jetbrainsLink);
}

/**
 * Inicializar página común
 */
function initCommon() {
    loadFonts();
    initAuth();
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

/**
 * Validar email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Sanitizar string (prevenir XSS básico)
 */
function sanitizeString(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Copiar al portapapeles
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋', 'Copiado al portapapeles');
    }).catch(() => {
        showNotification('❌', 'Error al copiar', true);
    });
}

/**
 * Detectar si es móvil
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}