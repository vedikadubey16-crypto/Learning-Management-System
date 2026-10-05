# EduSphere Debug Fixes

Fixed in this source:

- Added a dedicated responsive sidebar to Course Recommendations.
- Added mobile sidebar open/close behavior.
- Fixed Course Recommendations navigation links.
- Added a dedicated recommendations stylesheet so the page does not depend on dashboard CSS being loaded first.
- Removed the broken dashboard profile API effect that referenced an undefined `setProfile` state setter.
- Prevented the dashboard recommendation request from sending fabricated zero values for required ML history fields.
- Preserved dashboard analytics fields so recommendation history can be passed to the ML API when the backend provides them.
- Fixed Study Material sidebar links that pointed to routes not registered in the React router.
- Kept the existing backend and ML URLs unchanged.

Important: the ZIP intentionally excludes `node_modules`. Run `npm install` after extracting it.
