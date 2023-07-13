import { ReactNode } from "react";
import { classNames } from "@/utility/classNames";
import { firaMono } from "@/pages";

export type ForeignNodeWrapper = {
  width: number | undefined;
  height: number | undefined;
  children?: ReactNode;
  isObject: boolean;
};

export function ForeignNodeWrapper(props: ForeignNodeWrapper) {
  return (
    <foreignObject
      style={{ width: props.width, height: props.height }}
      className={classNames(
        firaMono.className,
        !props.isObject ? "text-center" : "",
        "pointer-events-none overflow-hidden font-medium",
      )}
    >
      {props.children}
    </foreignObject>
  );
}
