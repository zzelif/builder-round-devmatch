import { CardHeader, CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import React, { ReactNode } from "react";

type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
};

export default function CardInnerWrapper({ header, body, footer }: Props) {
  return (
    <>
      <CardHeader>
        {typeof header === "string" ? (
          <div className="text-2xl font-semibold text-default">{header}</div>
        ) : (
          <>{header}</>
        )}
      </CardHeader>
      <Separator />
      <CardContent>{body}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  );
}
