/// <reference types="vite/client" />

declare class VConsole {
  constructor(opt: { theme?:'dark' | 'light' });
  destroy(): void;
}
