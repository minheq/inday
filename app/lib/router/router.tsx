import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { match, compile } from 'path-to-regexp';
import { isEmpty, keysOf, last } from '../../../lib/js_utils';

interface UseNavigation {
  setParams: (params: Params) => void;
  navigate: (name: string, params: Params) => void;
  goBack: () => void;
}

export function useNavigationImplementation(): UseNavigation {
  const { navigate, goBack, setParams } = useContext(RouterContext);

  return {
    setParams,
    navigate,
    goBack,
  };
}

type Stack = Action[];

interface RouterContext {
  name: string;
  params: Params;
  stack: Stack;
  pathMap: PathMap;
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
  setParams: () => {
    return;
  },
  goBack: () => {
    return;
  },
});

interface Params {
  [param: string]: string;
}

interface State {
  stack: Stack;
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
  | { type: 'NAVIGATE'; name: string; params: Params }
  | { type: 'GO_BACK' }
  | { type: 'SET_PARAMS'; params: Params };

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
  pathMap: PathMap;
}

function getInitialState(pathMap: PathMap): State {
  let name = '';
  let params: Params = {};

  const screens = keysOf(pathMap) as string[];

  for (const _name of screens) {
    const { path } = pathMap[_name];
    const matcher = match<Params>(path, { decode: decodeURIComponent });
    const result = matcher(window.location.pathname);

    if (result !== false) {
      name = _name;
      params = result.params;
    }
  }

  return {
    name,
    params,
    stack: [],
  };
}

export function RouterImplementation(props: RouterProps): JSX.Element {
  const { pathMap, fallback } = props;

  const [state, dispatch] = useReducer(reducer, getInitialState(pathMap));
  const { stack, name, params } = state;

  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const handleNavigate = useCallback(
    (nextName: string, nextParams: Params) => {
      if (pathMap[nextName] !== undefined) {
        dispatch({ type: 'NAVIGATE', name: nextName, params: nextParams });
      } else {
        console.error(`Screen ${nextName} was not set up`);
      }
    },
    [pathMap],
  );

  const handleSetParams = useCallback((nextParams: Params) => {
    dispatch({ type: 'SET_PARAMS', params: nextParams });
  }, []);

  const Screen = name !== '' ? pathMap[name].component : null;
  const child =
    Screen !== null ? <Screen name={name} params={params} /> : fallback;

  return (
    <RouterContext.Provider
      value={{
        name,
        params,
        stack,
        pathMap,
        goBack: handleGoBack,
        navigate: handleNavigate,
        setParams: handleSetParams,
      }}
    >
      <BrowserHistorySync />
      {child}
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
          compile(pathMap[action.name].path, { encode: encodeURIComponent })(
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
          compile(pathMap[name].path, { encode: encodeURIComponent })(
            action.params,
          ),
        );
        break;
      default:
        break;
    }
  }, [stack, name, pathMap]);

  return <Fragment />;
}
