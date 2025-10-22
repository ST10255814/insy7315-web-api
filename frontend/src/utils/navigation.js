// Navigation utility to handle programmatic navigation from non-component files
let navigate = null;

export const setNavigate = (navigateFunction) => {
  navigate = navigateFunction;
};

export const navigateTo = (path) => {
  if (navigate) {
    navigate(path);
  } else {
    // Fallback to window.location if navigate is not available
    console.warn('Navigate function not available, falling back to window.location');
    window.location.href = path;
  }
};

export const getNavigate = () => navigate;