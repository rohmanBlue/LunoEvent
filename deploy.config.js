module.exports = {
  apps: [
    {
      name: 'web',
      cwd: './apps/web',
      script: 'npm',
      args: 'run serve',
      env: { NODE_ENV: 'production' },
      watch: false,
      max_restarts: 10,
      restart_delay: 3000
    },
    {
      name: 'api',
      cwd: './apps/api',
      script: 'npm',
      args: 'run serve',
      env: { NODE_ENV: 'production', PORT: 8000 },
      watch: false,
      max_restarts: 10,
      restart_delay: 3000
    }
  ]
<<<<<<< HEAD
}
=======
}
>>>>>>> b96df1ee61017496d72da211dae11d1e23576340
