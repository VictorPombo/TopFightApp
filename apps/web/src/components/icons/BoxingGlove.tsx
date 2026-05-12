import React from 'react';
import { LucideProps } from 'lucide-react';

export const BoxingGlove = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      {/* Luva Esquerda */}
      <path d="M10 14V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6c0 3.5 2 6 5 6h1" />
      <path d="M10 14h-3" />
      <path d="M6 10v4a2 2 0 0 1-2-2v-2" />
      <path d="M8 6l2-4 2 4" />
      
      {/* Luva Direita */}
      <path d="M14 14V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6c0 3.5-2 6-5 6h-1" />
      <path d="M14 14h3" />
      <path d="M18 10v4a2 2 0 0 0 2-2v-2" />
      <path d="M16 6l-2-4-2 4" />
    </svg>
  );
};
