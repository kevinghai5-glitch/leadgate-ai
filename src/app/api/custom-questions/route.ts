import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Support both authenticated (settings) and public (form) access
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    let targetUserId: string;

    if (userId) {
      // Public access for form rendering
      targetUserId = userId;
    } else {
      // Authenticated access for settings
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      targetUserId = session.user.id;
    }

    const questions = await prisma.customQuestion.findMany({
      where: { userId: targetUserId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Get custom questions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom questions" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questions } = await req.json();

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Questions must be an array" },
        { status: 400 }
      );
    }

    // Delete all existing custom questions and replace
    await prisma.$transaction([
      prisma.customQuestion.deleteMany({
        where: { userId: session.user.id },
      }),
      ...questions.map(
        (q: { label: string; type: string; options?: string; required: boolean }, i: number) =>
          prisma.customQuestion.create({
            data: {
              userId: session.user.id,
              label: q.label,
              type: q.type || "text",
              options: q.options || null,
              required: q.required ?? false,
              order: i,
            },
          })
      ),
    ]);

    return NextResponse.json({ message: "Custom questions saved" });
  } catch (error) {
    console.error("Save custom questions error:", error);
    return NextResponse.json(
      { error: "Failed to save custom questions" },
      { status: 500 }
    );
  }
}
