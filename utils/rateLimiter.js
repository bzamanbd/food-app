import { rateLimit } from 'express-rate-limit'

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: 'draft-7',
  legacyHeaders:false,
});
export default rateLimiter