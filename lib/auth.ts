import bcrypt from "bcryptjs"
import { sql } from "./db"

export interface User {
  id: number
  name: string
  email: string
  userType: "manufacturer" | "supplier",
  createdAt: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  userType: "manufacturer" | "supplier",
  role: 'user'|"admin"
): Promise<User> {
  const hashedPassword = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (name, email, password, user_type, role)
    VALUES (${name}, ${email}, ${hashedPassword}, ${userType}, ${role})
    RETURNING id, name, email, user_type as "userType", created_at as "createdAt"
  `

  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | null> {
 const result = await sql`
  SELECT id, name, email, password, user_type as "userType", created_at as "createdAt"
  FROM users
  WHERE email = ${email}
`;
  

  return result[0] as (User & { password: string }) | null
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
