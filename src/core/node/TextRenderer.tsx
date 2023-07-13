import { CSSProperties } from "react";

export type TextRenderer = {
  innerText: string;
  style?: CSSProperties;
  classNames?: string;
};

export function TextRenderer(props: TextRenderer) {
  return (
    <span style={props.style} className={props.classNames}>
      {props.innerText}
    </span>
  );
}
