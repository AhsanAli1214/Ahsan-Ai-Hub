// Accessibility utility component for enhanced ARIA support
export const addAriaHidden = (element: HTMLElement) => {
  element.setAttribute('aria-hidden', 'true');
};

export const addAriaLabel = (element: HTMLElement, label: string) => {
  element.setAttribute('aria-label', label);
};

export const ensureMinTouchTarget = (element: HTMLElement) => {
  // Ensure minimum 48x48px touch target
  element.style.minWidth = 'max(48px, auto)';
  element.style.minHeight = 'max(48px, auto)';
};
