import Badge from '../ui/Badge'

function TechList({ limit, technologies }) {
  const visibleTechnologies = limit ? technologies.slice(0, limit) : technologies

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTechnologies.map((technology) => (
        <Badge key={technology} tone="cyan">
          {technology}
        </Badge>
      ))}
    </div>
  )
}

export default TechList
