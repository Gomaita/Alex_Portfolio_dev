import DemoNote from './DemoNote'

function DemoNotice({ children, className = '' }) {
  return <DemoNote className={className}>{children}</DemoNote>
}

export default DemoNotice
