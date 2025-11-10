import sql from '@/app/api/utils/sql';

// GET - Get single service request
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const result = await sql`
      SELECT * FROM service_requests 
      WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching service request:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch service request' },
      { status: 500 }
    );
  }
}

// PUT - Update service request
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, progress, location } = body;
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    if (status !== undefined) {
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    
    if (progress !== undefined) {
      updateFields.push(`progress = $${paramCount}`);
      values.push(progress);
      paramCount++;
    }
    
    if (location !== undefined) {
      updateFields.push(`location = $${paramCount}`);
      values.push(location);
      paramCount++;
    }
    
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (updateFields.length === 1) { // Only timestamp update
      return Response.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }
    
    values.push(id);
    const query = `
      UPDATE service_requests 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await sql(query, values);
    
    if (result.length === 0) {
      return Response.json(
        { success: false, error: 'Service request not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error updating service request:', error);
    return Response.json(
      { success: false, error: 'Failed to update service request' },
      { status: 500 }
    );
  }
}