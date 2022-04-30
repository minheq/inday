import React, { useCallback } from "react";

import { TextLink } from "./text_link";

interface URLLinkProps {
  text: string;
  url: string;
}

export function URLLink(props: URLLinkProps): JSX.Element {
  const { url, text } = props;

  const handlePress = useCallback(() => {
    console.log("send url", url);
  }, [url]);

  return <TextLink text={text} onPress={handlePress} />;
}
