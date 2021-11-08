/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export function Circle(props: React.SVGProps<SVGCircleElement>): JSX.Element {
  return <circle {...props} />;
}

export function ClipPath(
  props: React.SVGProps<SVGClipPathElement>,
): JSX.Element {
  return <clipPath {...props} />;
}

export function Defs(props: React.SVGProps<SVGDefsElement>): JSX.Element {
  return <defs {...props} />;
}

export function Ellipse(props: React.SVGProps<SVGEllipseElement>): JSX.Element {
  return <ellipse {...props} />;
}

export function G(props: React.SVGProps<SVGGElement>): JSX.Element {
  return <g {...props} />;
}

export function Image(props: React.SVGProps<SVGImageElement>): JSX.Element {
  return <image {...props} />;
}

export function Line(props: React.SVGProps<SVGLineElement>): JSX.Element {
  return <line {...props} />;
}

export function LinearGradient(
  props: React.SVGProps<SVGLinearGradientElement>,
): JSX.Element {
  return <linearGradient {...props} />;
}

export function Path(props: React.SVGProps<SVGPathElement>): JSX.Element {
  return <path {...props} />;
}

export function Polygon(props: React.SVGProps<SVGPolygonElement>): JSX.Element {
  return <polygon {...props} />;
}

export function Polyline(
  props: React.SVGProps<SVGPolylineElement>,
): JSX.Element {
  return <polyline {...props} />;
}

export function RadialGradient(
  props: React.SVGProps<SVGRadialGradientElement>,
): JSX.Element {
  return <radialGradient {...props} />;
}

export function Rect(props: React.SVGProps<SVGRectElement>): JSX.Element {
  return <rect {...props} />;
}

export function Stop(props: React.SVGProps<SVGStopElement>): JSX.Element {
  return <stop {...props} />;
}

export function Svg(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return <svg {...props} />;
}

export function Symbol(props: React.SVGProps<SVGSymbolElement>): JSX.Element {
  return <symbol {...props} />;
}

export function Text(props: React.SVGProps<SVGTextElement>): JSX.Element {
  return <text {...props} />;
}

export function TSpan(props: React.SVGProps<SVGTSpanElement>): JSX.Element {
  return <tspan {...props} />;
}

export function TextPath(
  props: React.SVGProps<SVGTextPathElement>,
): JSX.Element {
  return <textPath {...props} />;
}

export function Use(props: React.SVGProps<SVGUseElement>): JSX.Element {
  return <use {...props} />;
}

export function Mask(props: React.SVGProps<SVGMaskElement>): JSX.Element {
  return <mask {...props} />;
}

export function ForeignObject(
  props: React.SVGProps<SVGForeignObjectElement>,
): JSX.Element {
  return <foreignObject {...props} />;
}

export function Marker(props: React.SVGProps<SVGMarkerElement>): JSX.Element {
  return <marker {...props} />;
}

export function Pattern(props: React.SVGProps<SVGPatternElement>): JSX.Element {
  return <pattern {...props} />;
}

export default Svg;
