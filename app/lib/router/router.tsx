import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Pathname } from '../../../lib/pathname';
import { ObjectUtils } from '../../../lib/js_utils';

interface UseNavigation {
  setParams: (params: Params) => void;
  push: (name: string, params: Params) => void;
  back: () => void;
}

export function useNavigationImplementation(): UseNavigation {
  const { push, back, setParams } = useContext(RouterContext);

  return { setParams, push, back };
}

interface RouterContext {
  name: string;
  params: Params;
  lastAction: Action | null;
  pathMap: PathMap;
  browserUpdate: (name: string, params: Params) => void;
  setParams: (params: Params) => void;
  push: (name: string, params: Params) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContext>({
  name: '',
  params: {},
  pathMap: {},
  lastAction: null,
  browserUpdate: () => {
    return;
  },
  push: () => {
    return;
  },
  setParams: () => {
    return;
  },
  back: () => {
    return;
  },
});

interface Params {
  [param: string]: string;
}

interface State {
  lastAction: Action | null;
  name: string;
  params: Params;
}

type PathMap = {
  [name: string]: {
    path: string;
    component: (props: { name: string; params: Params }) => JSX.Element;
  };
};

type Action =
  | { type: 'PUSH'; name: string; params: Params }
  | { type: 'BACK' }
  | { type: 'SET_PARAMS'; params: Params }
  | { type: 'BROWSER_UPDATE'; name: string; params: Params };

function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case 'PUSH':
      return {
        ...prevState,
        name: action.name,
        params: action.params,
        lastAction: action,
      };
    case 'SET_PARAMS':
      return {
        ...prevState,
        params: action.params,
        lastAction: action,
      };
    case 'BROWSER_UPDATE':
      return {
        ...prevState,
        name: action.name,
        params: action.params,
        lastAction: null,
      };
    case 'BACK':
      return {
        ...prevState,
        lastAction: action,
      };
    default:
      console.error(action); // it should be never
      throw new Error(`Action not handled`);
  }
}

interface RouterProps {
  fallback: React.ReactNode;
  pathMap: PathMap;
}

function getInitialState(pathMap: PathMap): State {
  let name = '';
  let params: Params = {};

  const screens = ObjectUtils.keysOf(pathMap) as string[];

  for (const _name of screens) {
    const { path } = pathMap[_name];
    const result = Pathname.match<Params>(path, window.location.pathname);

    if (result !== false) {
      name = _name;
      params = result;
    }
  }

  return {
    name,
    params,
    lastAction: null,
  };
}

export function RouterImplementation(props: RouterProps): JSX.Element {
  const { pathMap, fallback } = props;

  const [state, dispatch] = useReducer(reducer, getInitialState(pathMap));
  const { lastAction, name, params } = state;

  const handleGoBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  const handleNavigate = useCallback((nextName: string, nextParams: Params) => {
    dispatch({ type: 'PUSH', name: nextName, params: nextParams });
  }, []);

  const handleSetParams = useCallback((nextParams: Params) => {
    dispatch({ type: 'SET_PARAMS', params: nextParams });
  }, []);

  const handleBrowserUpdate = useCallback(
    (nextName: string, nextParams: Params) => {
      dispatch({ type: 'BROWSER_UPDATE', name: nextName, params: nextParams });
    },
    [],
  );

  const Screen = name !== '' ? pathMap[name].component : null;
  const child =
    Screen !== null ? <Screen name={name} params={params} /> : fallback;

  return (
    <RouterContext.Provider
      value={{
        name,
        params,
        lastAction,
        pathMap,
        browserUpdate: handleBrowserUpdate,
        back: handleGoBack,
        push: handleNavigate,
        setParams: handleSetParams,
      }}
    >
      <BrowserHistorySync />
      {child}
    </RouterContext.Provider>
  );
}

interface HistoryState {
  name: string;
  params: Params;
}

function BrowserHistorySync(): JSX.Element {
  const { lastAction, pathMap, name, params, browserUpdate } = useContext(
    RouterContext,
  );

  const handleBrowserPopState = useCallback(
    (event: PopStateEvent) => {
      const nextState = event.state as HistoryState | null;

      if (nextState !== null) {
        const { name: nextName, params: nextParams } = nextState;

        browserUpdate(nextName, nextParams);
      }
    },
    [browserUpdate],
  );

  useEffect(() => {
    window.addEventListener('popstate', handleBrowserPopState);

    return () => {
      window.removeEventListener('popstate', handleBrowserPopState);
    };
  }, [handleBrowserPopState]);

  useEffect(() => {
    if (lastAction === null) {
      return;
    }

    const state: HistoryState = { name, params };

    if (lastAction.type === 'PUSH') {
      history.pushState(
        state,
        name,
        Pathname.compile(pathMap[name].path, params),
      );
    } else if (lastAction.type === 'SET_PARAMS') {
      history.replaceState(
        state,
        name,
        Pathname.compile(pathMap[name].path, params),
      );
    } else if (lastAction.type === 'BACK') {
      history.back();
    }
  }, [lastAction, name, params, pathMap]);

  return <Fragment />;
}
