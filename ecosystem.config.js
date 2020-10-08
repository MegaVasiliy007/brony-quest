module.exports = {
    apps: [
        {
            name: 'front-brony-quest',
            cwd: '/srv/brony-quest/client',
            script: './node_modules/nuxt/bin/nuxt.js',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                NUXT_PORT: 3030
            }
        },
        {
            name: 'back-brony-quest',
            cwd: '/srv/brony-quest/api',
            script: 'index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 8000
            }
        }
    ]
}