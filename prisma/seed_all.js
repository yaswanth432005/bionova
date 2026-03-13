const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found to seed applications for.');
    return;
  }

  const appsTemplate = [
    { company: 'Google', role: 'Software Engineer', status: 'Interviewing', salary: '$150k', location: 'Remote', link: 'https://google.com/jobs', notes: 'First interview scheduled', appliedDate: new Date(), deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { company: 'Meta', role: 'Product Manager', status: 'Applied', salary: '$180k', location: 'Menlo Park', link: 'https://meta.com/jobs', appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
    { company: 'Amazon', role: 'Cloud Architect', status: 'Offer', salary: '$160k', location: 'Seattle', appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { company: 'Netflix', role: 'Senior Engineer', status: 'Rejected', salary: '$250k', location: 'Los Gatos', appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), deadline: null },
    { company: 'Microsoft', role: 'DevOps', status: 'Interviewing', salary: '$140k', location: 'Redmond', appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
  ];

  for (const user of users) {
    console.log(`Seeding for user: ${user.email || user.id}...`);
    for (const app of appsTemplate) {
      await prisma.jobApplication.create({
        data: {
          ...app,
          userId: user.id
        }
      });
    }
  }

  console.log(`Successfully seeded ${appsTemplate.length * users.length} applications across ${users.length} users.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
