import NProgress from 'nprogress';

// https://github.com/rstacruz/nprogress

let timer: string | number | NodeJS.Timeout;
let loadingState: 'loading' | 'finished';
const delay = 250;

export function startLoading() {
  if (loadingState === 'loading') return;

  loadingState = 'loading';

  timer = setTimeout(() => {
    NProgress.start();
  }, delay);
}

export function finishLoading() {
  loadingState = 'finished';

  clearTimeout(timer);
  NProgress.done();
}
