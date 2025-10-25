
## High-Level Goals
- It is a **Golang desktop application** using the **Wails framework (Version 2.10)**.
- The frontend is built with **SvelteKit (Svelte 5)** and using TypeScript for development.
- The frontend is using following following packages:
  - `Tailwind CSS` for styling.
  - `Incon Park SVG` for icons.
  - `Ark UI` for headless UI components.
- The application is named **ElasticGaze**.
- The application is intended to be a **cross-platform desktop app**.
- The application is using **pnpm** as the package manager for the frontend.

## Specific Instructions
1. Always use the `wails dev` command to run the application in development mode.\
2. Use `wails build` to create production builds of the application.
3. There is no need to use `wails generate` as wails v2 does code generation automatically.
4. Always use windows powershell or cmd for running commands related to this project.
5. Do not add any placeholders or dummy data in code if I didn't explicitly asked for it.
6. The backend code of the application should be written in Golang and it should be placed in the `backend` folder.
7. The frontend code of the application should be written in SvelteKit and it should be placed in the `frontend` folder.
8. Do not install any additional packages or dependencies unless I explicitly ask for it.
9. Follow best practices for both Golang and SvelteKit development.