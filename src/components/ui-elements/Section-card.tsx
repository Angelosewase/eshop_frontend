import React from 'react';
import { cn } from '../../lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  tag?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ 
  title, 
  description, 
  children, 
  className,
  tag
}) => {
  return (
    <div className={cn(
      'glass-card p-6 animate-fade-in mb-6',
      className
    )}>
      <div className="mb-6">
        {tag && (
          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground mb-2">
            {tag}
          </span>
        )}
        <h3 className="text-xl font-medium mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;