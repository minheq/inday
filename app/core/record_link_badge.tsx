import React from 'react';
import { Badge } from '../components';
import { palette } from '../components/palette';
import { TextFieldKindValue } from '../data/fields';

interface RecordLinkBadgeProps {
  title: TextFieldKindValue;
}

export function RecordLinkBadge(props: RecordLinkBadgeProps): JSX.Element {
  const { title } = props;

  return <Badge color={palette.purple[50]} title={title} />;
}
