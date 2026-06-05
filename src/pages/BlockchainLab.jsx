import BlockchainLabPage from '../components/blockchain-lab/BlockchainLabPage'
import usePageTitle from '../hooks/usePageTitle'

function BlockchainLab() {
  usePageTitle('Blockchain Lab | Alex Gómez')

  return <BlockchainLabPage />
}

export default BlockchainLab
