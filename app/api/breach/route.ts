import { NextResponse, type NextRequest } from "next/server"

/**
 * Privacy-preserving proxy for the Have I Been Pwned "range" endpoint.
 *
 * The client hashes the password locally (SHA-1) and sends ONLY the first
 * five hex characters of the digest as `?prefix=`. The full hash — and
 * therefore the password — never reaches this server. We forward the prefix
 * to HIBP and stream the raw `SUFFIX:COUNT` body back so the browser can
 * finish the match locally.
 */

const HIBP_RANGE_ENDPOINT = "https://api.pwnedpasswords.com/range"
const PREFIX_PATTERN = /^[0-9A-Fa-f]{5}$/

export async function GET(req: NextRequest) {
  const prefix = req.nextUrl.searchParams.get("prefix")

  if (!prefix || !PREFIX_PATTERN.test(prefix)) {
    return NextResponse.json(
      { error: "A 5-character hexadecimal prefix is required." },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(`${HIBP_RANGE_ENDPOINT}/${prefix.toUpperCase()}`, {
      headers: {
        "Add-Padding": "true",
        "User-Agent": "KASCORE-Vault/1.0",
      },
      // Cache identical prefix lookups for an hour to reduce upstream load.
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Breach service returned ${response.status}` },
        { status: 502 },
      )
    }

    const body = await response.text()

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[breach-api]", error)
    return NextResponse.json(
      { error: "Failed to reach the breach database." },
      { status: 500 },
    )
  }
}
