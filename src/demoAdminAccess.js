import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import prisma from './config/prisma.js';

dotenv.config();

const apiPort = process.env.PORT || 3000;
const apiUrl = `http://localhost:${apiPort}/api/auth`;

const adminUser = {
  email: 'admin@example.com',
  password: 'Admin123!',
  name: 'Admin User',
};

const normalUser = {
  email: 'user@example.com',
  password: 'User123!',
  name: 'Normal User',
};

async function createOrUpdateUser({ email, password, name }, role) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        role,
      },
    });
  }

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });
}

async function loginUser(credentials) {
  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Login failed (${response.status}): ${body}`);
  }

  return response.json();
}

async function callAdminEndpoint(token) {
  const response = await fetch(`${apiUrl}/user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json().catch(() => null);
  return {
    status: response.status,
    body,
  };
}

async function main() {
  if (typeof fetch !== 'function') {
    throw new Error('fetch is not available in this Node environment. Use Node 18+ or install a fetch polyfill.');
  }

  console.log(`Using API base URL: ${apiUrl}`);
  console.log('Creating admin and normal user accounts...');

  await createOrUpdateUser(adminUser, 'ADMIN');
  await createOrUpdateUser(normalUser, 'USER');

  console.log('Accounts ready. Logging in...');

  const adminLogin = await loginUser({ email: adminUser.email, password: adminUser.password });
  const normalLogin = await loginUser({ email: normalUser.email, password: normalUser.password });

  console.log('Admin login token:', adminLogin.token);
  console.log('Normal user login token:', normalLogin.token);

  console.log('\nCalling admin-only endpoint with ADMIN token...');
  const adminResponse = await callAdminEndpoint(adminLogin.token);
  console.log('Admin response status:', adminResponse.status);
  console.log('Admin response body:', adminResponse.body);

  console.log('\nCalling admin-only endpoint with USER token...');
  const userResponse = await callAdminEndpoint(normalLogin.token);
  console.log('User response status:', userResponse.status);
  console.log('User response body:', userResponse.body);
}

main()
  .catch((error) => {
    console.error('Demo failed:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
