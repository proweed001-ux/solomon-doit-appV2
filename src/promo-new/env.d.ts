/// <reference types="vite/client" />

declare const __PROMO_BUILD_ID__: string;
declare const __PROMO_STAGING_PREVIEW__: boolean;

declare module '*?url' {
  const url: string;
  export default url;
}
