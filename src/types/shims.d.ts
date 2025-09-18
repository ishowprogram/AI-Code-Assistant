// Minimal React and JSX shims so TS can type-check without installed @types
declare module 'react' {
  export function useState<S = unknown>(
    initialState?: S | (() => S)
  ): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'lucide-react' {
  export const Loader2: any;
  export const CheckCircle: any;
  export const AlertCircle: any;
  export const Info: any;
  const defaultExport: any;
  export default defaultExport;
}


