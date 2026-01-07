// Accessibility utilities

export const skipToContent = () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const handleKeyboardNavigation = (
  e: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void
) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onEnter?.();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    onEscape?.();
  }
};

