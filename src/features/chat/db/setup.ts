import { seedChats } from './seed'

async function setup() {
	console.log('Starting database setup...')
	await seedChats()
	console.log('Database setup completed')
}

setup().catch(console.error)
