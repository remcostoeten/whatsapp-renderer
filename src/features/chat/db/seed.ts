import { v4 as uuidv4 } from 'uuid'
import { db } from '.'
import { chats } from './schema'

export async function seedChats() {
	try {
		await db.insert(chats).values([
			{
				id: uuidv4(),
				name: 'Test Chat 1',
				lastMessage: 'Hello World',
				timestamp: new Date()
			},
			{
				id: uuidv4(),
				name: 'Test Chat 2',
				lastMessage: 'Testing chat functionality',
				timestamp: new Date()
			}
			// Add more test chats as needed
		])
		console.log('Test chats seeded successfully')
	} catch (error) {
		console.error('Error seeding chats:', error)
	}
}
