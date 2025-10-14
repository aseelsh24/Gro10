declare module 'react-router-dom' {
  // Function types
  export function useNavigate(): (path: string, options?: { replace?: boolean }) => void;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  };
  export function useParams<P extends Record<string, string>>(): P;

  // Component types
  export interface RouteProps {
    path: string;
    element: React.ReactNode;
    children?: RouteProps[];
  }

  export function BrowserRouter(props: { children: React.ReactNode }): JSX.Element;
  export function Routes(props: { children: React.ReactNode }): JSX.Element;
  export function Route(props: RouteProps): JSX.Element;
  export function Link(props: { to: string; children: React.ReactNode }): JSX.Element;
  export function NavLink(props: { to: string; children: React.ReactNode; className?: string | ((props: { isActive: boolean }) => string); }): JSX.Element;

  // Hook types
  export function useMatch(pattern: string): { params: Record<string, string>; pathname: string } | null;
  export function useSearchParams(): [URLSearchParams, (nextInit: URLSearchParams) => void];
}