// ========================================
// Toast Notification System - Quick Reference
// ========================================

import { toast } from '$lib/components/ui/toastComponent';

// Basic usage with default options (info accent, 5s duration)
toast.show('Hello, World!');

// Success notification
toast.show('File uploaded successfully!', {
  accent: 'success',
  duration: 5000
});

// Error notification
toast.show('Upload failed. Please retry.', {
  accent: 'error'
});

// Warning notification
toast.show('Storage space is running low.', {
  accent: 'warning'
});

// Info notification
toast.show('New updates are available.', {
  accent: 'info'
});

// Primary notification
toast.show('Primary notification message.', {
  accent: 'primary'
});

// Secondary notification
toast.show('Secondary notification message.', {
  accent: 'secondary'
});

// Accent notification
toast.show('Accent notification message.', {
  accent: 'accent'
});

// Persistent toast (no auto-dismiss)
toast.show('This requires manual dismissal', {
  accent: 'warning',
  duration: 0
});

// Custom duration (2 seconds)
toast.show('Quick message', {
  accent: 'info',
  duration: 2000
});

// Multiple toasts (they stack automatically)
toast.show('First notification', { accent: 'success' });
toast.show('Second notification', { accent: 'info' });
toast.show('Third notification', { accent: 'warning' });

// Remove specific toast
const toastId = toast.show('Loading...', {
  accent: 'info',
  duration: 0
});
// Later...
toast.remove(toastId);

// Clear all toasts
toast.clear();

// ========================================
// Real-world Examples
// ========================================

// Form validation
function handleSubmit(formData: FormData) {
  if (!isValid(formData)) {
    toast.show('Please fill all required fields', {
      accent: 'error',
      duration: 4000
    });
    return;
  }
  
  submitForm(formData);
  toast.show('Form submitted successfully!', {
    accent: 'success'
  });
}

// File upload with loading state
async function uploadFile(file: File) {
  const loadingId = toast.show('Uploading file...', {
    accent: 'info',
    duration: 0
  });
  
  try {
    await api.upload(file);
    toast.remove(loadingId);
    toast.show('File uploaded successfully!', {
      accent: 'success'
    });
  } catch (error) {
    toast.remove(loadingId);
    toast.show('Upload failed. Please try again.', {
      accent: 'error'
    });
  }
}

// Copy to clipboard
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.show('Copied to clipboard!', {
      accent: 'success',
      duration: 2000
    });
  } catch {
    toast.show('Failed to copy', {
      accent: 'error'
    });
  }
}

// API error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Network error');
    }
    toast.show('Data loaded successfully', {
      accent: 'success',
      duration: 3000
    });
  } catch (error) {
    toast.show('Failed to load data. Check your connection.', {
      accent: 'error'
    });
  }
}

// ========================================
// ToastProvider Configuration
// ========================================

// In your +layout.svelte or component:
/*
<ToastProvider position="top-right" />     // Default
<ToastProvider position="top-left" />
<ToastProvider position="top-center" />
<ToastProvider position="bottom-right" />
<ToastProvider position="bottom-left" />
<ToastProvider position="bottom-center" />
*/

// ========================================
// TypeScript Types
// ========================================

/*
type ToastAccent = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'accent';

interface Toast {
  id: string;
  message: string;
  accent: ToastAccent;
  duration: number;
}

interface ToastOptions {
  accent?: ToastAccent;
  duration?: number;
}
*/
