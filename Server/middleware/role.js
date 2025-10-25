export const checkoutRole = (req, res, next) => {
    try {
        if (req.userRole === 2) {
            next();
        } else {
           return res.status(403).json({ error: 'Admin access required' });
        }

    } catch (error) {
       return res.status(401).json({ error: 'Невалидный токен' })
    }
}