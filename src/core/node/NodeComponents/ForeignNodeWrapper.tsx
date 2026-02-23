import { ReactNode } from "react";
import { classNames } from "@/utility/classNames";
import { firaMono } from "@/pages";

export type ForeignNodeWrapper = {
  width: number | undefined;
  height: number | undefined;
  children?: ReactNode;
  isObject: boolean;
  nodeId?: string;
  isHighlighted?: boolean;
};

export function ForeignNodeWrapper(props: ForeignNodeWrapper) {
  return (
    <foreignObject
      width={props.width}
      height={props.height}
      style={{ overflow: "hidden" }}
      {...(props.nodeId && { "data-node-id": props.nodeId })}
      className={classNames(
        firaMono.className,
        !props.isObject ? "text-center" : "",
        "pointer-events-none font-medium",
        props.isHighlighted ? "bg-[#ffd63427]" : "",
      )}
    >
      <div
        {...({ xmlns: "http://www.w3.org/1999/xhtml" } as Record<
          string,
          string
        >)}
        style={{ width: props.width, height: props.height }}
      >
        {props.children}
      </div>
    </foreignObject>
  );
}
