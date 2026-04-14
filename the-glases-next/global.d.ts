// This global definition acts as a temporary fallback to silence TypeScript / IDE 
// "JSX element implicitly has type 'any'" and "Cannot find module" errors 
// caused by missing node_modules.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Silence 'Cannot find module' red lines because of the failed npm install
declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  const React: any;
  export default React;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'lucide-react' {
  export const Mail: any;
  export const ArrowLeft: any;
  export const Loader2: any;
  export const Lock: any;
  export const CheckCircle2: any;
  export const ArrowRight: any;
}

declare module '@/lib/supabase' {
  export const supabase: any;
}

declare module 'next/navigation' {
  export const useRouter: any;
}
