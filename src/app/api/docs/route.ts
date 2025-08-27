import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Override display labels for specific product titles
const DISPLAY_OVERRIDES: Record<string, string> = {
  'AD4080': 'AD4080 Data Sheet (Rev. A)',
  'AD4081': 'AD4081 Data Sheet (Rev. 0)',
  'AD4084': 'AD4084 Data Sheet (Rev. 0)',
  'AD9207': 'AD9207 Data Sheet (Rev. 0)',
  'LTM2173-14': 'LTM2173-14 Data Sheet (Rev. A)',
  'ADE9112': 'ADE9112 Data Sheet (Rev. A)',
  'ADUM7704': 'ADUM7704 Data Sheet (Rev. A)',
  'ADE7912': 'ADE7912 Data Sheet (Rev. C)',
  'ADE7913': 'ADE7913 Data Sheet (Rev. C)'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const id = searchParams.get('id')

  try {
    // If looking for a specific document by ID (for tooltip preview)
    if (id) {
      const document = await prisma.document.findUnique({
        where: { id },
        select: { id: true, title: true, content: true }
      })
      return NextResponse.json(document)
    }

    // Search documents for mentions dropdown
    const documents = await prisma.document.findMany({
      where: q
        ? {
            OR: [
              {
                title: {
                  contains: q,
                },
              },
              {
                content: {
                  contains: q,
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        title: true,
        content: true
      },
      orderBy: {
        title: 'asc'
      },
      take: 8 // Limit to 8 results as specified
    })

    // Transform for react-mentions format
    const mentionData = documents.map(doc => ({
      id: doc.id,
      display: DISPLAY_OVERRIDES[doc.title] ?? doc.title,
      description: (doc.content ?? '').replace(/\s+/g, ' ').slice(0, 90)
    }))

    return NextResponse.json(mentionData)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
