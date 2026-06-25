export const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
  };
  
  export const sendError = (res, message = "Error", statusCode = 400) => {
    return res.status(statusCode).json({ success: false, message });
  };
  
  export const sendPaginated = (res, data, total, page, limit) => {
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  };