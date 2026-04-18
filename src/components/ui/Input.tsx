import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground',
            'placeholder:text-muted-foreground transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-destructive focus:ring-destructive'
              : 'border-input-border hover:border-primary-lighter focus:border-primary',
            className
          )}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <p id={`${inputId}-helper`} className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export { Input }
