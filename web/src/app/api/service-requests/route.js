import sql from '@/app/api/utils/sql';

// GET - List all service requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM service_requests';
    let params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const requests = await sql(query, params);
    
    return Response.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch service requests' },
      { status: 500 }
    );
  }
}

// POST - Create new service request
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, details, location } = body;
    
    if (!name || !email || !details) {
      return Response.json(
        { success: false, error: 'Name, email, and details are required' },
        { status: 400 }
      );
    }
    
    const result = await sql`
      INSERT INTO service_requests (name, email, details, location)
      VALUES (${name}, ${email}, ${details}, ${location || null})
      RETURNING *
    `;
    
    return Response.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    return Response.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}