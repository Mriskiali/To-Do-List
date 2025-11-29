import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  const toast = (props: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => {
    const { title, description, variant = 'default' } = props;
    
    sonnerToast(title, {
      description,
      className: variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : '',
      duration: 3000,
    });
  };

  return { toast };
};