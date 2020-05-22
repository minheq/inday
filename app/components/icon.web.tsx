import React from 'react';
import * as Bootstrap from 'react-icons/bs';
import * as Feather from 'react-icons/fi';
import * as Octicon from 'react-icons/go';
import * as FontAwesome from 'react-icons/fa';
import * as AntDesign from 'react-icons/ai';

import { useTheme } from '../theme';

import { IconProps } from './icon';

function convertToPascal(name: string) {
  const converter = (matches: string) => {
    return matches[1].toUpperCase();
  };

  const result = name.replace(/(\-\w)/g, converter);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function CustomIcon(props: IconProps) {
  const { name, color = 'default', size = 'md' } = props;
  const theme = useTheme();

  const iconColor = theme.text.color[color];
  const iconSize = theme.text.size[size].fontSize;

  switch (name) {
    case 'quote':
      return <Octicon.GoQuote color={iconColor} size={iconSize} />;
    case 'font':
      return <FontAwesome.FaFont color={iconColor} size={iconSize} />;
    case 'undo':
      return <AntDesign.AiOutlineUndo color={iconColor} size={iconSize} />;
    case 'redo':
      return <AntDesign.AiOutlineRedo color={iconColor} size={iconSize} />;
    case 'strikethrough':
      return (
        <Bootstrap.BsTypeStrikethrough color={iconColor} size={iconSize} />
      );

    default:
      return null;
  }
}

export const Icon = (props: IconProps) => {
  const { name, color = 'default', size = 'md' } = props;
  const theme = useTheme();

  const customIcon = CustomIcon(props);

  if (customIcon) {
    return customIcon;
  }
  // @ts-ignore
  const IconTag = Feather[`Fi${convertToPascal(name)}`];

  return (
    <IconTag
      color={theme.text.color[color]}
      size={theme.text.size[size].fontSize}
    />
  );
};
