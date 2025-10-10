mmodule.exports = {
  apps: [
    {
      name: "api",
      script: "apps/api/dist/src/index.js", // backend build
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
    {
      name: "web",
      script: "npm",
      args: "run serve",           // Next.js 14+ SSR
      cwd: "apps/web",
      interpreter: "bash",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],

 
};
