import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeroProps {
  backgroundImage?: string;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

export function Hero({
  backgroundImage,
  title,
  subtitle,
  className = "",
  breadcrumbItems,
}: HeroProps) {
  return (
    <section
      className={`relative isolate overflow-hidden py-40 ${className}`}
    >
      {/* Background Image */}
      {backgroundImage && (
        <img 
          src={backgroundImage} 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,18,0.55),rgba(16,12,26,0.85))]" />
      
      <div className="container mx-auto relative px-4">
        {breadcrumbItems && breadcrumbItems.length > 0 && (
          <nav className="mb-10">
            <ol className="flex items-center space-x-2 text-sm text-white/80">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-white">
                      {item.label}
                    </a>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {(title || subtitle) && (
          <div className="mx-auto text-center w-full md:w-1/2 mt-10">
            {title && (
              <h1 className="font-sans font-semibold text-center
                text-[40px] leading-[43px] tracking-[-0.02em]
                md:text-[48px] md:leading-[60px] text-[#F5F5F6]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-4 text-center font-sans
                text-[14px] leading-[20px] font-normal
                md:text-[18px] md:leading-[28px] md:font-medium
                tracking-normal text-[#F5F5F6]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}