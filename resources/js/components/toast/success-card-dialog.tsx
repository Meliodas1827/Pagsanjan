// components/SuccessDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { Link } from "@inertiajs/react"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description: string
  link?: boolean
  linkString? : string
  buttonTitle: string
}

export function SuccessDialog({ open, onOpenChange, title = "Success!", description, link=false, linkString, buttonTitle }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Close button */}


        {/* Content */}
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          {/* Success Icon with animation */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 animate-in zoom-in-50 duration-300" />
          </div>

          {/* Title */}
          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          <p className="text-center text-muted-foreground max-w-sm leading-relaxed">
            {description}
          </p>

          {/* Action Button */}
          {!link ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] mt-4"
              size="lg"
            >
             {buttonTitle}
            </Button>
          ) : (
            <Link href={`/${linkString}`}>
            <Button variant={'default'} className="cursor-pointer">

              {buttonTitle}
            </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}