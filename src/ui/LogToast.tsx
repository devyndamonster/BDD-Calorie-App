import { useEffect } from 'react'

type Props = {
  message: string
  id: number
  onDone: () => void
}

const DURATION_MS = 2000

export default function LogToast({ message, id, onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, DURATION_MS)
    return () => clearTimeout(timer)
  }, [id, onDone])

  return (
    <div className="log-toast" role="status" data-testid="log-toast">
      {message}
    </div>
  )
}
