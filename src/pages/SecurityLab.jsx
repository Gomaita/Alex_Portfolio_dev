import SecurityLabPage from '../components/security-lab/SecurityLabPage'
import usePageTitle from '../hooks/usePageTitle'

function SecurityLab() {
  usePageTitle('Security Lab | Alex Gómez')

  return <SecurityLabPage />
}

export default SecurityLab
