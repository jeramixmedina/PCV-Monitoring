# Architecture Overview

## Design Goals
- Lightweight and low-RAM usage
- Offline-first operation
- Modular and beginner-friendly code organization
- Clear separation between process layers

## Layers
- **Main process (`src/main`)**: Electron lifecycle, IPC, file and DB access.
- **Renderer process (`src/renderer`)**: UI views, forms, and module scripts.
- **Shared (`src/shared`)**: constants, utility helpers, and validation logic used across modules.
- **Scripts (`scripts`)**: operational scripts for backup/restore tasks.
