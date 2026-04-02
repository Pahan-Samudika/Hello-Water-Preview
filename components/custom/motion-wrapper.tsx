"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import React from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export function MotionWrapper({ children, ...props }: MotionWrapperProps) {
  return <motion.div {...props}>{children}</motion.div>;
}
