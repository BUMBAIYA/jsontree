export type TextRenderer = {
  innerText: string;
};

export function TextRenderer(props: TextRenderer) {
  return <>{props.innerText}</>;
}
