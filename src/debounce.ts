export function debounce(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout | undefined;
  
    return function(...args: any[]): void {
      const later = () => {
        timeout = undefined;
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  