// Hilfsfunktionen
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function generateToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// API Handler
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS Request für CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders
        });
    }

    try {
        // Registrierung
        if (url.pathname === '/api/register' && request.method === 'POST') {
            const { name, username, password } = await request.json();

            // Überprüfe, ob Benutzername existiert
            const existingUser = await USERS.get(username);
            if (existingUser) {
                return new Response(JSON.stringify({
                    message: 'Benutzername existiert bereits!'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            // Erstelle neuen Benutzer
            const hashedPassword = await hashPassword(password);
            const user = {
                name,
                username,
                password: hashedPassword,
                created_at: new Date().toISOString(),
                progress: {}
            };

            // Speichere Benutzer
            await USERS.put(username, JSON.stringify(user));

            return new Response(JSON.stringify({
                message: 'Registrierung erfolgreich!'
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Login
        if (url.pathname === '/api/login' && request.method === 'POST') {
            const { username, password } = await request.json();

            // Lade Benutzer
            const userData = await USERS.get(username);
            if (!userData) {
                return new Response(JSON.stringify({
                    message: 'Ungültige Anmeldedaten!'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            const user = JSON.parse(userData);
            const hashedPassword = await hashPassword(password);

            if (user.password !== hashedPassword) {
                return new Response(JSON.stringify({
                    message: 'Ungültige Anmeldedaten!'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            // Erstelle Token
            const token = await generateToken();
            user.token = token;
            delete user.password;

            // Aktualisiere Benutzer mit Token
            await USERS.put(username, JSON.stringify({
                ...JSON.parse(userData),
                token
            }));

            return new Response(JSON.stringify({
                message: 'Login erfolgreich!',
                user
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Speichern des Lernfortschritts
        if (url.pathname === '/api/progress' && request.method === 'POST') {
            const { username, token, progress } = await request.json();

            // Überprüfe Token
            const userData = await USERS.get(username);
            if (!userData) {
                return new Response(JSON.stringify({
                    message: 'Benutzer nicht gefunden!'
                }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            const user = JSON.parse(userData);
            if (user.token !== token) {
                return new Response(JSON.stringify({
                    message: 'Ungültiger Token!'
                }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            // Aktualisiere Fortschritt
            user.progress = { ...user.progress, ...progress };
            await USERS.put(username, JSON.stringify(user));

            return new Response(JSON.stringify({
                message: 'Fortschritt gespeichert!'
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        return new Response(JSON.stringify({
            message: 'Nicht gefunden!'
        }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            message: 'Ein Fehler ist aufgetreten!'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
} 