const renderCategoryNames = new Set([
  'project render',
  'projects render',
  'project renders',
  'render projects',
  'renders',
  'render',
])

function categoryName(category) {
  return typeof category === 'string' ? category : category?.name
}

function isRenderCategory(category) {
  return renderCategoryNames.has(String(categoryName(category) || '').trim().toLowerCase())
}

export function moveRenderCategoryLast(categories = []) {
  const normalCategories = categories.filter((category) => !isRenderCategory(category))
  const renderCategories = categories.filter(isRenderCategory)
  return [...normalCategories, ...renderCategories]
}
