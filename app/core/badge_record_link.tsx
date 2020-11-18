import React from 'react';
import { Badge } from '../components';
import { palette } from '../components/palette';
import { TextFieldKindValue } from '../data/fields';

interface BadgeRecordLinkProps {
  title: TextFieldKindValue;
}

export function BadgeRecordLink(props: BadgeRecordLinkProps): JSX.Element {
  const { title } = props;

  return <Badge color={palette.purple[50]} title={title} />;
}
