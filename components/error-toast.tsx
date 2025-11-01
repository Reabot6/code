import { toast } from "sonner"

interface ErrorToastOptions {
  title?: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function showErrorToast(error: unknown, options?: Partial<ErrorToastOptions>) {
  const description = error instanceof Error ? error.message : String(error)

  toast.error(options?.title || "Something went wrong", {
    description: options?.description || description,
    action: options?.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
  })
}

export function showSuccessToast(title: string, description?: string) {
  toast.success(title, {
    description: description || "",
  })
}

export function showLoadingToast(title: string) {
  return toast.loading(title)
}

export function updateToast(id: string | number, message: string, type: "success" | "error" = "success") {
  toast[type](message)
}
