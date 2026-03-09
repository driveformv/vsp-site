import { useCallback, useState } from 'react'
import { type DocumentActionProps, type DocumentActionDescription } from 'sanity'

export function ValidateEventAction(props: DocumentActionProps): DocumentActionDescription {
  const [loading, setLoading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState<string | null>(null)

  const handleValidate = useCallback(async () => {
    setLoading(true)
    setDialogMessage(null)
    try {
      const res = await fetch('/api/validate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(props.draft || props.published),
      })
      const result = await res.json()

      if (result.isValid) {
        setDialogMessage('Event looks good -- no issues found.')
      } else {
        const messages = result.issues
          .map((issue: { severity: string; message: string }) =>
            `[${issue.severity.toUpperCase()}] ${issue.message}`
          )
          .join('\n')
        setDialogMessage(messages)
      }
    } catch {
      setDialogMessage('Validation failed. Check your network connection.')
    } finally {
      setLoading(false)
    }
  }, [props.draft, props.published])

  return {
    label: loading ? 'Validating...' : 'Validate Event',
    onHandle: handleValidate,
    disabled: loading,
    dialog: dialogMessage
      ? {
          type: 'confirm',
          message: dialogMessage,
          onCancel: () => setDialogMessage(null),
          onConfirm: () => setDialogMessage(null),
        }
      : undefined,
  }
}
