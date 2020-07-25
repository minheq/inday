import React from 'react';
import { LinkValue } from './nodes/link';

interface EditableProviderContext {
  onSelectLink: (value: LinkValue) => void;
}

const EditableProviderContext = React.createContext<EditableProviderContext>({
  onSelectLink: () => {},
});

export function useEditable() {
  return React.useContext(EditableProviderContext);
}

interface EditableProviderProps {
  onSelectLink: (value: LinkValue) => void;
  children?: React.ReactNode;
}

export function EditableProvider(props: EditableProviderProps) {
  const { children, onSelectLink } = props;

  return (
    <EditableProviderContext.Provider
      value={{
        onSelectLink,
      }}
    >
      {children}
    </EditableProviderContext.Provider>
  );
}
