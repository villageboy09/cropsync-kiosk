import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  iconClassName = "text-muted-foreground"
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        {Icon && (
          <div className="mb-6">
            <Icon className={`h-24 w-24 ${iconClassName}`} strokeWidth={2} />
          </div>
        )}
        
        {title && (
          <h3 className="text-2xl font-semibold mb-3 text-center">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            {description}
          </p>
        )}
        
        {actionLabel && onAction && (
          <Button onClick={onAction} size="lg">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default EmptyState;
