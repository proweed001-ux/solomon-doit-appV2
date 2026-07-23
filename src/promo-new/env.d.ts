/// <reference types="vite/client" />

declare const __PROMO_BUILD_ID__: string;

declare module '*?url' {
  const url: string;
  export default url;
}
