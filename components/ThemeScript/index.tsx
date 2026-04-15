/* eslint-disable react/no-danger */
// This inline script must run synchronously before first paint to prevent
// a flash of the wrong theme. dangerouslySetInnerHTML is safe here because
// the content is a static, hardcoded string with no user input.

const THEME_INIT =
  `(function(){try{var t=localStorage.getItem('theme');` +
  `document.documentElement.setAttribute('data-theme',` +
  `t==='dark'||t==='light'?t:` +
  `window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');` +
  `}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
