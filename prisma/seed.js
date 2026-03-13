const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found to seed applications for.');
    return;
  }

  const apps = [
    {
      company: 'Google',
      role: 'Software Engineer',
      status: 'Interviewing',
      salary: '$150k',
      location: 'Remote',
      link: 'https://google.com/jobs',
      notes: 'First interview scheduled',
      appliedDate: new Date()
    },
    {
      company: 'Meta',
      role: 'Product Manager',
      status: 'Applied',
      salary: '$180k',
      location: 'Menlo Park',
      link: 'https://meta.com/jobs',
      appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      company: 'Amazon',
      role: 'Cloud Architect',
      status: 'Offer',
      salary: '$160k',
      location: 'Seattle',
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      company: 'Netflix',
      role: 'Senior Engineer',
      status: 'Rejected',
      salary: '$250k',
      location: 'Los Gatos',
      appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      company: Microsoft = 'Microsoft',
      role: 'DevOps',
      status: 'Interviewing',
      salary: '$140k',
      location: 'Redmond',
      appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const app of apps) {
    await prisma.jobApplication.create({
      data: {
        ...app,
        userId: user.id
      }
    });
  }

  console.log('Seeded 5 applications.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });