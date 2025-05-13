
import { useToast as useToastOriginal, toast as toastOriginal } from "@/hooks/use-toast";

// Re-export with SEO-friendly descriptions for analytics tracking
export const useToast = useToastOriginal;

export const toast = {
  ...toastOriginal,
  success: (props: { title?: string; description?: string }) => {
    return toastOriginal({
      ...props,
      variant: "default",
    });
  },
  error: (props: { title?: string; description?: string }) => {
    return toastOriginal({
      ...props,
      variant: "destructive",
    });
  },
  loading: (props: { title?: string; description?: string }) => {
    return toastOriginal({
      ...props,
      variant: "default",
    });
  },
};
