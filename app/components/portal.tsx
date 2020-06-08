import ReactDOM from 'react-dom';

interface PortalProps {
  children?: React.ReactNode;
}

export function Portal(props: PortalProps) {
  const { children } = props;

  return ReactDOM.createPortal(children, document.body);
}
