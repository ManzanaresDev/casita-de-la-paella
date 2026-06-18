// app/api/auth/login/route.ts
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { sql } from "@/lib/db";
import { COOKIE_NAME, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifiant = body.identifiant?.trim();
    const password = body.password?.trim();

    if (!identifiant || !password) {
      return NextResponse.json({ message: "Champs requis" }, { status: 400 });
    }

    const users = await sql`
    SELECT *
    FROM admin_users
    WHERE identifiant = ${identifiant}
    LIMIT 1
    `;
    const admin = users[0];

    if (!admin) {
      return NextResponse.json(
        { message: "identifiant invalide" },
        { status: 401 },
      );
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);

    if (!validPassword) {
      return NextResponse.json(
        { message: "mot de passe invalide" },
        { status: 401 },
      );
    }

    const token = await signToken({
      userId: admin.id,
      identifiant: admin.identifiant,
    });
    const response = NextResponse.json({ success: true });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 1, // 1 jour de validité pour le token
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
