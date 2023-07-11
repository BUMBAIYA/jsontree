import { CSSProperties } from "react";

export type TextRenderer = {
  innerText: string;
  style?: CSSProperties;
};

export function TextRenderer(props: TextRenderer) {
  return <span style={props.style}>{props.innerText}</span>;
}
