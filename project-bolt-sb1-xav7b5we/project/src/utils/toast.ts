// Simple toast notification utility
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // In a real app, you would use a toast library like react-hot-toast
  },
  error: (message: string) => {
    console.log('❌ Error:', message);
    // In a real app, you would use a toast library like react-hot-toast
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    // In a real app, you would use a toast library like react-hot-toast
  },
};