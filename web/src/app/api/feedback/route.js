import sql from '@/app/api/utils/sql';

// GET - List all feedback
export async function GET(request) {
  try {
    const feedback = await sql`
      SELECT * FROM feedback 
      ORDER BY created_at DESC
    `;
    
    return Response.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST - Create new feedback
export async function POST(request) {
  try {
    const body = await request.json();
    const { rating, comment } = body;
    
    if (!rating || rating < 1 || rating > 5) {
      return Response.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    const result = await sql`
      INSERT INTO feedback (rating, comment)
      VALUES (${rating}, ${comment || null})
      RETURNING *
    `;
    
    return Response.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return Response.json(
      { success: false, error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}