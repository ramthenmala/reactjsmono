import React from "react";

interface ImageSectionProps {
  backgroundImage?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
  hasOverlay?: boolean;
  overlayClassName?: string;
}

export function ImageSection({
  backgroundImage,
  alt = "Background image",
  className = "",
  imageClassName = "",
  children,
  hasOverlay = false,
  overlayClassName = "bg-[linear-gradient(180deg,rgba(10,9,18,0.55),rgba(16,12,26,0.85))]",
}: ImageSectionProps) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`}>
      {/* Background Image */}
      {backgroundImage && (
        <img 
          src={backgroundImage} 
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
        />
      )}
      
      {/* Overlay */}
      {hasOverlay && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}
      
      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </section>
  );
}