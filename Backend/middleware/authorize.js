const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = allowedRoles
      .flat()
      .map((r) => String(r).trim().toLowerCase());

    console.log(" BOUNCER DEBUG LOG");
    console.log(" Allowed Roles Expected:", roles);
    console.log(" User Payload From Token:", req.user);
    console.log(" User Role Found:", req.user?.role);

    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ error: "Access Denied. No role found in token." });
    }

    const userRole = String(req.user.role).trim().toLowerCase();

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "Access Denied. Admins Only." });
    }

    next();
  };
};

module.exports = authorizeRole;
