import React, { useContext } from "react";

type Direction = "column" | "row";

interface ContainerContext {
  direction: Direction;
}

const ContainerContext = React.createContext<ContainerContext>({
  direction: "column",
});

interface ContainerProviderProps {
  children?: React.ReactNode;
  direction: Direction;
}

export function ContainerProvider(props: ContainerProviderProps): JSX.Element {
  const { children, direction } = props;

  return (
    <ContainerContext.Provider value={{ direction }}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useParentContainer(): ContainerContext {
  return useContext(ContainerContext);
}
