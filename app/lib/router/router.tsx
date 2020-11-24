import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { match, compile } from 'path-to-regexp';
import { usePrevious } from '../../hooks/use_previous';
import { isEmpty, last } from '../../../lib/js_utils';

interface UseNavigation<
  T extends RouterMap,
  ScreenName extends keyof T,
  Params extends T[ScreenName]
> {
  reset: () => void;
  setParams: (params: Params) => void;
  navigate: (name: string, params: Params) => void;
  goBack: () => void;
}

function useNavigation(): UseNavigation<
  { [name: string]: Record<string, string> },
  string,
  Record<string, string>
> {
  const { navigate, goBack, setParams, reset } = useContext(RouterContext);

  return {
    reset,
    setParams,
    navigate,
    goBack,
  };
}

interface UseRoute<
  T extends RouterMap,
  ScreenName extends keyof T,
  Params extends T[ScreenName]
> {
  name: string;
  params: Params;
}

function useRoute(): UseRoute<
  { [name: string]: Record<string, string> },
  string,
  Record<string, string>
> {
  const context = useContext(RouterContext);

  return {
    name: context.name,
    params: context.params,
  };
}

type Stack = Action[];

interface RouterContext {
  pathMap: PathMap;
  name: string;
  params: Params;
  stack: Stack;
  reset: () => void;
  setParams: (params: Params) => void;
  navigate: (name: string, params: Params) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContext>({
  name: '',
  params: {},
  pathMap: {},
  stack: [],
  navigate: () => {
    return;
  },
  reset: () => {
    return;
  },
  setParams: () => {
    return;
  },
  goBack: () => {
    return;
  },
});

type RouterMap = {
  [name: string]: Params;
};

interface Params {
  [param: string]: string;
}

interface State {
  pathMap: PathMap;
  stack: Stack;
  name: string;
  params: Params;
}

type PathMap = { [name: string]: string };

type Action =
  | { type: 'NAVIGATE'; name: string; params: Params }
  | { type: 'GO_BACK' }
  | { type: 'SET_PARAMS'; params: Params }
  | { type: 'RESET' };

function reducer(prevState: State, action: Action): State {
  prevState = {
    ...prevState,
    stack: prevState.stack.concat(action),
  };

  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...prevState,
        name: action.name,
        params: action.params,
      };
    case 'SET_PARAMS':
      return {
        ...prevState,
        params: action.params,
      };
    case 'RESET':
      return {
        ...prevState,
        params: {},
        name: '',
      };
    case 'GO_BACK':
      return {
        ...prevState,
      };
    default:
      console.error(action); // it should be never
      throw new Error(`Action not handled`);
  }
}

interface RouterProps {
  fallback: React.ReactNode;
  children: React.ReactElement<RouteProps<string>>[];
}

function getInitialState(screens: { name: string; path: string }[]): State {
  const pathMap: PathMap = {};
  let name = '';
  let params: Params = {};

  for (const { name: _name, path } of screens) {
    const matcher = match<Params>(path, { decode: decodeURIComponent });
    const result = matcher(window.location.pathname);

    pathMap[_name] = path;

    if (result !== false) {
      name = _name;
      params = result.params;
    }
  }

  return {
    name,
    params,
    pathMap,
    stack: [],
  };
}

function Router(props: RouterProps): JSX.Element {
  const { children, fallback } = props;
  const [state, dispatch] = useReducer(
    reducer,
    getInitialState(
      React.Children.map(children, (child) => ({
        name: child.props.name,
        path: child.props.path,
      })),
    ),
  );
  const prevChildren = usePrevious(children);
  const { pathMap, stack, name, params } = state;

  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const handleNavigate = useCallback((nextName: string, nextParams: Params) => {
    dispatch({ type: 'NAVIGATE', name: nextName, params: nextParams });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleSetParams = useCallback((nextParams: Params) => {
    dispatch({ type: 'SET_PARAMS', params: nextParams });
  }, []);

  useEffect(() => {
    if (React.Children.count(children) !== React.Children.count(prevChildren)) {
      throw new Error('Router children must not change.');
    }
  }, [children, prevChildren]);

  let child: React.ReactNode = null;

  for (const _child of children) {
    if (_child.props.name === name) {
      child = _child;
    }
  }

  return (
    <RouterContext.Provider
      value={{
        name,
        params,
        stack,
        pathMap,
        reset: handleReset,
        goBack: handleGoBack,
        navigate: handleNavigate,
        setParams: handleSetParams,
      }}
    >
      <BrowserHistorySync />
      {child !== null ? child : fallback}
    </RouterContext.Provider>
  );
}

function BrowserHistorySync(): JSX.Element {
  const { stack, pathMap, name } = useContext(RouterContext);

  useEffect(() => {
    if (isEmpty(stack)) {
      return;
    }

    const action = last(stack);

    switch (action.type) {
      case 'NAVIGATE':
        history.pushState(
          null,
          action.name,
          compile(pathMap[action.name], { encode: encodeURIComponent })(
            action.params,
          ),
        );
        break;
      case 'GO_BACK':
        history.back();
        break;
      case 'SET_PARAMS':
        history.replaceState(
          null,
          name,
          compile(pathMap[name], { encode: encodeURIComponent })(action.params),
        );
        break;
      default:
        break;
    }
  }, [stack, name, pathMap]);

  return <Fragment />;
}

interface RouteProps<T> {
  path: string;
  name: T;
  children: React.ReactNode;
}

function Route(props: RouteProps<string>): JSX.Element {
  const { children, name, path } = props;
  const prevName = usePrevious(name);
  const prevPath = usePrevious(path);

  useEffect(() => {
    if (prevName !== name || prevPath !== path) {
      throw new Error(
        'Screen name or path changed for component. Paths should be static. Remove any dynamic code that reassigns screen name or paths.',
      );
    }
  }, [name, path, prevName, prevPath]);

  return <Fragment>{children}</Fragment>;
}

interface CreateRouter<T extends RouterMap> {
  useNavigation: () => UseNavigation<T, keyof T, T[keyof T]>;
  useRoute: <Name extends keyof T>() => UseRoute<T, Name, T[Name]>;
  Router: (props: {
    fallback: React.ReactNode;
    children: React.ReactElement<RouteProps<keyof T>>[];
  }) => JSX.Element;
  Route: (props: RouteProps<keyof T>) => JSX.Element;
}

export function createRouter<T extends RouterMap>(): CreateRouter<T> {
  return {
    useNavigation: useNavigation as () => UseNavigation<T, keyof T, T[keyof T]>,
    useRoute: useRoute as <Name extends keyof T>() => UseRoute<
      T,
      Name,
      T[Name]
    >,
    Router: Router as (props: {
      fallback: React.ReactNode;
      children: React.ReactElement<RouteProps<keyof T>>[];
    }) => JSX.Element,
    Route: Route as (props: RouteProps<keyof T>) => JSX.Element,
  };
}
