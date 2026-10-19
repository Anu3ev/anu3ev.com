import { readContentInventory } from './lib/content'

const { projects, posts, excluded } = readContentInventory()
console.log(`Content valid: ${projects.filter(project => project.isPublic).length} project translations, ${posts.filter(post => post.isPublic).length} article translations, ${excluded.length} drafts/future entries excluded.`)
