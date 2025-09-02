export type TDebounced<F extends (...args: any[]) => any> =
  ((...args: Parameters<F>) => void) & { cancel: () => void; flush: () => void };

export function debounce<F extends (...args: any[]) => any>(
  fn: F,
  wait = 250
): TDebounced<F> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: any;

  const debounced = function (this: any, ...args: Parameters<F>) {
    if (timer) clearTimeout(timer);
    lastArgs = args;
    lastThis = this;
    timer = setTimeout(() => {
      timer = null;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - spread is safe for Parameters<F>
      fn.apply(lastThis, lastArgs as Parameters<F>);
      lastArgs = null;
      lastThis = null;
    }, wait);
  } as TDebounced<F>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fn.apply(lastThis, lastArgs as Parameters<F>);
    lastArgs = null;
    lastThis = null;
  };

  return debounced;
}