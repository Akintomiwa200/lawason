import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { getProfile } from "@/lib/event-queries";
import { requireUser } from "@/lib/require-session";

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  education: z
    .array(
      z.object({
        school: z.string(),
        degree: z.string(),
        dates: z.string().optional(),
      }),
    )
    .optional(),
  jobs: z
    .array(
      z.object({
        title: z.string(),
        company: z.string(),
        dates: z.string().optional(),
      }),
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  interestTags: z.array(z.string()).optional(),
});

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ profile: null });
  }

  try {
    const session = await requireUser();
    const profile = await getProfile(session.user.id);
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ profile: null }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const data = profileSchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        location: data.location,
        bio: data.bio,
        facebook: data.facebook,
        twitter: data.twitter,
        linkedin: data.linkedin,
        instagram: data.instagram,
        education: data.education,
        jobs: data.jobs,
        skills: data.skills,
        interestTags: data.interestTags,
      },
    });

    const profile = await getProfile(session.user.id);
    return NextResponse.json({ profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
