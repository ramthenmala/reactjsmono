import React from "react";

export interface ImageSectionProps {
  backgroundImage?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
  hasOverlay?: boolean;
  overlayClassName?: string;
}