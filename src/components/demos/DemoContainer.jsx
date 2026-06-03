import Card from '../ui/Card'

function DemoContainer({ children, note }) {
  return (
    <Card className="overflow-hidden p-4 sm:p-5">
      {note && <p className="mb-4 text-sm leading-6 text-slate-600">{note}</p>}
      {children}
    </Card>
  )
}

export default DemoContainer
