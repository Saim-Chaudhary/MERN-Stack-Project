const { randomUUID } = require('crypto');
const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();
const SESSION_PREFIX = 'auth-session:';
const DEFAULT_SESSION_TTL_SECONDS = 24 * 60 * 60;

const parseCookies = (cookieHeader = '') => {
    return cookieHeader.split(';').reduce((cookies, item) => {
        const [rawKey, ...rawValueParts] = item.trim().split('=');
        if (!rawKey) {
            return cookies;
        }

        const key = rawKey.trim();
        const value = rawValueParts.join('=').trim();
        if (key) {
            cookies[key] = decodeURIComponent(value || '');
        }

        return cookies;
    }, {});
};

const getSessionCookieName = () => 'sid';

const createSession = async (user) => {
    const sessionId = randomUUID();
    const sessionData = {
        user: {
            id: String(user.id),
            role: user.role,
            fullName: user.fullName,
            email: user.email
        }
    };

    await redis.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(sessionData), {
        ex: DEFAULT_SESSION_TTL_SECONDS
    });

    return { sessionId, sessionData };
};

const getSession = async (sessionId) => {
    if (!sessionId) {
        return null;
    }

    const rawSession = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!rawSession) {
        return null;
    }

    try {
        return typeof rawSession === 'string' ? JSON.parse(rawSession) : rawSession;
    } catch (error) {
        return null;
    }
};

const destroySession = async (sessionId) => {
    if (!sessionId) {
        return;
    }

    await redis.del(`${SESSION_PREFIX}${sessionId}`);
};

const getSessionIdFromRequest = (req) => {
    const cookies = parseCookies(req.headers.cookie || '');
    return cookies[getSessionCookieName()] || null;
};

const getSessionCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DEFAULT_SESSION_TTL_SECONDS * 1000,
    path: '/'
});

module.exports = {
    createSession,
    destroySession,
    getSession,
    getSessionCookieName,
    getSessionIdFromRequest,
    getSessionCookieOptions
};
