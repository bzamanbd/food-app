import appErr from "../utils/appErr.js";

export const isAdmin = async (req, res, next) => {
  try {
    const role = req.user.role    
    if (role !== 'admin')return next(appErr('Unauthorized access',401))
    next(); 
  } catch (e) {
    return next(appErr(e.message,500))
  }
}