import React from "react";
import Svg, { G, Path, Defs, ClipPath } from "./svg";
import { TextColor } from "./text";
import { theme } from "./theme";

type IconSize = "sm" | "md" | "lg";
interface IconProps {
  name: IconName;
  /**
   * @default 'md'
   */
  size?: IconSize;
  color?: TextColor;
  /** Overrides color */
  customColor?: string;
}

export function Icon(props: IconProps): JSX.Element {
  const { name, size = "md", color = "default", customColor } = props;
  const TheIcon = iconMap[name];

  return (
    <TheIcon size={sizeMap[size]} color={customColor ?? getIconColor(color)} />
  );
}

function getIconColor(color: TextColor): string {
  switch (color) {
    case "default":
      return theme.neutral.dark;

    // eslint-disable-next-line react-native/no-unused-styles
    case "success":
      return theme.success.default;

    // eslint-disable-next-line react-native/no-unused-styles
    case "primary":
      return theme.primary.dark;

    // eslint-disable-next-line react-native/no-unused-styles
    case "muted":
      return theme.neutral.default;

    // eslint-disable-next-line react-native/no-unused-styles
    case "error":
      return theme.danger.default;

    default:
      return theme.neutral.dark;
  }
}

export type IconName =
  | "AlignLeft"
  | "Archive"
  | "ArrowBarLeft"
  | "ArrowHorizontal"
  | "Attachment"
  | "BarCode"
  | "Bell"
  | "Bolt"
  | "Calculator"
  | "Calendar"
  | "CalendarEvent"
  | "CalendarMinus"
  | "CaretDown"
  | "CaretRight"
  | "ChartBar"
  | "Check"
  | "CheckThick"
  | "Checkbox"
  | "ChevronLeft"
  | "ChevronRight"
  | "Clock"
  | "Command"
  | "Currency"
  | "Dashboard"
  | "Dots"
  | "DotsInCircle"
  | "Email"
  | "LinkToDocument"
  | "Form"
  | "Formula"
  | "Grid"
  | "Help"
  | "Number"
  | "Board"
  | "Link"
  | "LookUp"
  | "Maximize"
  | "MultiSelect"
  | "Organize"
  | "Percentage"
  | "Phone"
  | "Plus"
  | "Pointer"
  | "RollUp"
  | "Search"
  | "Select"
  | "Star"
  | "Table"
  | "Typography"
  | "User"
  | "UserCheck"
  | "Users"
  | "X";

interface TheIconProps {
  size: number;
  color: string;
}

const sizeMap: {
  [name in IconSize]: number;
} = {
  sm: 18,
  md: 24,
  lg: 30,
};

const iconMap: {
  [name in IconName]: (props: TheIconProps) => JSX.Element;
} = {
  AlignLeft,
  Archive,
  ArrowBarLeft,
  ArrowHorizontal,
  Attachment,
  BarCode,
  Bell,
  Bolt,
  Calculator,
  Calendar,
  CalendarEvent,
  CalendarMinus,
  CaretDown,
  CaretRight,
  ChartBar,
  Check,
  CheckThick,
  Checkbox,
  ChevronLeft,
  ChevronRight,
  Clock,
  Command,
  Currency,
  Dashboard,
  Dots,
  DotsInCircle,
  Email,
  LinkToDocument,
  Form,
  Formula,
  Grid,
  Help,
  Number,
  Board,
  Link,
  LookUp,
  Maximize,
  MultiSelect,
  Organize,
  Percentage,
  Phone,
  Plus,
  Pointer,
  RollUp,
  Search,
  Select,
  Star,
  Table,
  Typography,
  User,
  UserCheck,
  Users,
  X,
};

function AlignLeft(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h16M4 12h16M4 18h12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Archive(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5a2 2 0 100 4h14a2 2 0 100-4zM5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 12h4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowBarLeft(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12h10M4 12l4 4M4 12l4-4M20 4v16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowHorizontal(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 8l-4 4 4 4M17 8l4 4-4 4M3 12h18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Attachment(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 7l-6.5 6.5a2.121 2.121 0 103 3L18 10a4.243 4.243 0 00-6-6l-6.5 6.5a6.364 6.364 0 009 9L21 13"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BarCode(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        clipPath="url(#clip0)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M4 7V6a2 2 0 012-2h2M4 17v1a2 2 0 002 2h2M16 4h2a2 2 0 012 2v1M16 20h2a2 2 0 002-2v-1M6 11H5v2h1v-2zM10 11v2M15 11h-1v2h1v-2zM19 11v2" />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function Bell(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M10 5a2 2 0 014 0 7 7 0 014 6v3a4 4 0 002 3H4a4 4 0 002-3v-3a7 7 0 014-6M9 17v1a3 3 0 006 0v-1" />
    </Svg>
  );
}

function Bolt(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 3v7h6l-8 11v-7H5l8-11z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Calculator(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 7H9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1zM8 14v.01M12 14v.01M16 14v.01M8 17v.01M12 17v.01M16 17v.01"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Calendar(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2zM16 3v4M8 3v4M4 11h16M11 15h1M12 15v3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarEvent(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        clipPath="url(#clip0)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M18 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2zM4 11h16" />
        <Path d="M10 15H8v2h2v-2z" />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function CalendarMinus(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2zM16 3v4M8 3v4M4 11h16M10 16h4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CaretDown(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6H6z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CaretRight(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6v12z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChartBar(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        clipPath="url(#clip0)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M8 12H4a1 1 0 00-1 1v6a1 1 0 001 1h4a1 1 0 001-1v-6a1 1 0 00-1-1zM14 8h-4a1 1 0 00-1 1v10a1 1 0 001 1h4a1 1 0 001-1V9a1 1 0 00-1-1zM20 4h-4a1 1 0 00-1 1v14a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zM4 20h14" />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function Check(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M5 12l5 5L20 7" />
    </Svg>
  );
}

function CheckThick(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M5 12l5 5L20 7" />
    </Svg>
  );
}

function Checkbox(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 11l3 3 8-8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronLeft(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6l-6 6 6 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M9 6L15 12 9 18" />
    </Svg>
  );
}

function Clock(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7v5l3 3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Command(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 9a2 2 0 112-2v10a2 2 0 11-2-2h10a2 2 0 11-2 2V7a2 2 0 112 2H7z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Currency(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.7 8A3 3 0 0014 6h-4a3 3 0 100 6h4a3 3 0 010 6h-4a3 3 0 01-2.7-2M12 18v3m0-18v3-3z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Dashboard(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 4H6a2 2 0 00-2 2v1a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2zM8 13H6a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2zM18 4h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2zM18 15h-2a2 2 0 00-2 2v1a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Dots(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13a1 1 0 100-2 1 1 0 000 2zM12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DotsInCircle(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 100-18 9 9 0 000 18zM8 12v.01M12 12v.01M16 12v.01"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Email(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 16a4 4 0 100-8 4 4 0 000 8z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 12v1.5a2.5 2.5 0 105 0V12a9 9 0 10-5.5 8.28"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LinkToDocument(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 21v-4a3 3 0 013-3h5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 17l3-3-3-3M14 3v4a1 1 0 001 1h4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 11V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2H7.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Form(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zM4 9h16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Formula(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.925 17.925 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Grid(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        clipPath="url(#clip0)"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M9 4H5a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zM19 4h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zM9 14H5a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1zM19 14h-4a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1z" />
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

function Help(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 17v.01"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 13.5a1.5 1.5 0 011-1.5 2.601 2.601 0 10-3-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Number(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 9h14M5 15h14M11 4L7 20M17 4l-4 16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Board(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h6M14 4h6M8 8H6a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2v-8a2 2 0 00-2-2zM18 8h-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Link(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 14a3.5 3.5 0 005 0l4-4a3.536 3.536 0 00-5-5l-.5.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 10a3.501 3.501 0 00-5 0l-4 4a3.535 3.535 0 105 5l.5-.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LookUp(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6h6a3 3 0 013 3v10m0 0l-4-4m4 4l4-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Maximize(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4h4v4M14 10l6-6M8 20H4v-4M4 20l6-6M16 20h4v-4M14 14l6 6M8 4H4v4M4 4l6 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MultiSelect(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 5.5L5 7l2.5-2.5M3.5 11.5L5 13l2.5-2.5M3.5 17.5L5 19l2.5-2.5M11 6h9M11 12h9M11 18h9"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Organize(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 8H4v4h4V8zM6 4v4M6 12v8M14 14h-4v4h4v-4zM12 4v10M12 18v2M20 5h-4v4h4V5zM18 4v1M18 9v11"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Percentage(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 18a1 1 0 100-2 1 1 0 000 2zM7 8a1 1 0 100-2 1 1 0 000 2zM6 18L18 6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Phone(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Plus(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Pointer(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h3M12 3v3M7.8 7.8L5.6 5.6M16.2 7.8l2.2-2.2M7.8 16.2l-2.2 2.2M12 12l9 3-4 2-2 4-3-9z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RollUp(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 19h6a3 3 0 003-3V6m0 0l-4 4m4-4l4 4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Search(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 17a7 7 0 100-14 7 7 0 000 14zM21 21l-6-6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Select(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11l3 3 3-3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Star(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873L12 17.75z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Table(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2zM4 10h16M10 4v16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Typography(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20h3M14 20h7M6.9 15h6.9M10.2 6.3L16 20M5 20l6-16h2l7 16"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function User(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 11a4 4 0 100-8 4 4 0 000 8zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UserCheck(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 11a4 4 0 100-8 4 4 0 000 8zM3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 11l2 2 4-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Users(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 11a4 4 0 100-8 4 4 0 000 8zM3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function X(props: TheIconProps) {
  const { size, color } = props;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
