module.exports = {
  apps: [
    {
      name: "api",
      script: "apps/api/server.js",
      cwd: "/root/nextTo", // ganti sesuai SSH_FOLDER kamu
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
    {
      name: "web",
      script: "npm",
      args: "run start --prefix apps/web",
      cwd: "/root/nextTo", // ganti sesuai SSH_FOLDER kamu
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
