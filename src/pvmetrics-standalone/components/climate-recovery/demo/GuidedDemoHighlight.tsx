import React from 'react';

export const GuidedDemoHighlight: React.FC<{ active: boolean; children: React.ReactNode }> = ({ active, children }) => (
  <div className={active ? 'rounded-3xl ring-2 ring-amber-400/70 ring-offset-4 ring-offset-slate-950 motion-reduce:transition-none' : ''}>
    {children}
  </div>
);
