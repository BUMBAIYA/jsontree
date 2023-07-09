import { ReactNode } from "react";
import { Fira_Mono } from "next/font/google";
import { classNames } from "@/utility/classNames";

const robotoMono = Fira_Mono({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
});

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
        robotoMono.className,
        !props.isObject ? "text-center" : "",
        props.isObject ? "p-2" : "",
        "pointer-events-none overflow-hidden font-medium text-red-500",
      )}
    >
      {props.children}
    </foreignObject>
  );
}
