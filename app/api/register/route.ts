import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

const pepper = process.env.PEPPER_SECRET || "";

// Define Zod schema for validation without username
const registerSchema = z.object({
  user: z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/\d/, "Password must include at least one digit")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must include at least one special character",
      ),
  }),
});

async function generateSalt(): Promise<string> {
  return await bcrypt.genSalt(10);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  // First add the pepper to the password, then hash with the salt
  return await bcrypt.hash(password + pepper, salt);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body with Zod
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      // Return validation errors
      return NextResponse.json(
        {
          user: null,
          message: "Validation failed",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    // Extract validated data
    const {
      user: { email, password },
    } = validationResult.data;

    const existingUserByEmail = await db.user.findUnique({
      where: { EMail: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Something went wrong" },
        { status: 409 },
      );
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    await db.user.create({
      data: {
        Role: 1,
        EMail: email,
        Password: hashedPassword,
        Salt: salt,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 },
    );
  }
}
