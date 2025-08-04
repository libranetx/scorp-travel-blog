const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@blog.com'
    }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash('admin123', 12)

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@blog.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created successfully:')
  console.log(`   Email: ${adminUser.email}`)
  console.log(`   Name: ${adminUser.name}`)
  console.log(`   Role: ${adminUser.role}`)
  console.log('   Password: admin123 (change this in production!)')

  // Create some sample posts
  const samplePosts = [
    {
      title: 'Welcome to Our Blog',
      content: 'This is the first post on our blog. Welcome everyone!',
      travelType: 'General'
    },
    {
      title: 'Getting Started with Travel Blogging',
      content: 'Learn how to start your own travel blog and share your adventures with the world.',
      travelType: 'Travel'
    },
    {
      title: 'Best Travel Destinations 2024',
      content: 'Discover the most amazing travel destinations for 2024. From beaches to mountains, we have it all covered.',
      travelType: 'Travel'
    }
  ]

  for (const post of samplePosts) {
    const createdPost = await prisma.post.create({
      data: post
    })
    console.log(`✅ Created post: ${createdPost.title}`)
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 