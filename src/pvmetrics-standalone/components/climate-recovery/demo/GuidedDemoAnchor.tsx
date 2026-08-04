import React from 'react';

export type GuidedDemoAnchorContract = {
  id: string;
  stepId: string;
  label: string;
};

export const GuidedDemoAnchor: React.FC<GuidedDemoAnchorContract> = ({ id, stepId, label }) => (
  <span
    id={id}
    data-guided-demo-anchor={stepId}
    tabIndex={-1}
    aria-label={label}
    className="block h-px w-full scroll-m-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
  />
);
