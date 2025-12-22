interface FormBackdropProps {
  color: string
}

export function FormBackdrop({ color }: FormBackdropProps) {
  return <div className="fixed inset-0 -z-10" style={{ backgroundColor: color }} />
}
