"use client";

import TOSContent from "@/mdx/tos.mdx";
import { FC } from "react";

export const TOS: FC = () => {
  return (
    <div className="w-full text-left">
      <TOSContent />
    </div>
  );
};
