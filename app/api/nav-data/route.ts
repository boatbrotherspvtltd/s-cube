import { NextResponse } from "next/server";
import { readCms } from "@/lib/cms/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cms = await readCms();
    return NextResponse.json({
      categories: cms.categories || [],
      products: cms.products || [],
      media: cms.media || [],
    });
  } catch (error) {
    console.error("Error fetching nav data:", error);
    return NextResponse.json(
      { categories: [], products: [], media: [] },
      { status: 500 }
    );
  }
}
