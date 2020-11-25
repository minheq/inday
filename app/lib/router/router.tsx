import React, {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { match, compile } from 'path-to-regexp';
import {
  append,
  areEqual,
  isEmpty,
  keysOf,
  last,
  remove,
  updateLast,
} from '../../../lib/js_utils';
import { usePrevious } from 'app/hooks/use_previous';

interface UseNavigation {
  setParams: (params: Params) => void;
  push: (name: string, params: Params) => void;
  back: () => void;
}

export function useNavigationImplementation(): UseNavigation {
  const { push, back, setParams } = useContext(RouterContext);

  return {
    setParams,
    push,
    back,
  };
}

type Stack = { name: string; params: Params }[];

interface RouterContext {
  name: string;
  params: Params;
  stack: Stack;
  pathMap: PathMap;
  setParams: (params: Params) => void;
  push: (name: string, params: Params) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContext>({
  name: '',
  params: {},
  pathMap: {},
  stack: [],
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
  | { type: 'PUSH'; name: string; params: Params }
  | { type: 'BACK' }
  | { type: 'SET_PARAMS'; params: Params };

function reducer(prevState: State, action: Action): State {
  const { stack: prevStack } = prevState;

  switch (action.type) {
    case 'PUSH':
      return {
        ...prevState,
        name: action.name,
        params: action.params,
        stack: append(prevStack, { name: action.name, params: action.params }),
      };
    case 'SET_PARAMS':
      return {
        ...prevState,
        params: action.params,
        stack: updateLast(prevStack, (item) => ({
          name: item.name,
          params: action.params,
        })),
      };
    case 'BACK':
      return {
        ...prevState,
        stack: remove(prevStack, 1),
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
    stack: name !== '' ? [{ name, params }] : [],
  };
}

export function RouterImplementation(props: RouterProps): JSX.Element {
  const { pathMap, fallback } = props;

  const [state, dispatch] = useReducer(reducer, getInitialState(pathMap));
  const { stack, name, params } = state;

  const handleGoBack = useCallback(() => {
    dispatch({ type: 'BACK' });
  }, []);

  const handleNavigate = useCallback(
    (nextName: string, nextParams: Params) => {
      if (pathMap[nextName] !== undefined) {
        dispatch({ type: 'PUSH', name: nextName, params: nextParams });
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

function BrowserHistorySync(): JSX.Element {
  const { stack, pathMap, name, params } = useContext(RouterContext);
  const prevStack = usePrevious(stack);

  useEffect(() => {
    if (isEmpty(stack) || isEmpty(prevStack)) {
      return;
    }

    // Stack has new items
    if (prevStack.length < stack.length) {
      history.pushState(
        null,
        name,
        compile(pathMap[name].path, { encode: encodeURIComponent })(params),
      );
      // Stack has removed bunch of items
    } else if (prevStack.length > stack.length) {
      history.go(-(prevStack.length - stack.length));
      // Stack updated last item
    } else if (prevStack.length === stack.length) {
      const lastPrevItem = last(prevStack);
      const lastItem = last(stack);

      if (
        lastPrevItem.name !== lastItem.name ||
        areEqual(lastPrevItem.params, lastItem.params) === false
      ) {
        history.replaceState(
          null,
          name,
          compile(pathMap[name].path, { encode: encodeURIComponent })(params),
        );
      }
    }
  }, [stack, prevStack, name, params, pathMap]);

  return <Fragment />;
}
