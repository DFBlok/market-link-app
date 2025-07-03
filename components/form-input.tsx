import type React from "react"
import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(error && "border-red-500 focus-visible:ring-red-500", className)}
          {...props}
        />
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

export { FormInput }
