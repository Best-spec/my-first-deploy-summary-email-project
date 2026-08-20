from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from main.services.auth_service import get_user_from_access_token

class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware that authenticates users via JWT in the Authorization header.
    If a valid JWT is provided, it sets request.user and disables CSRF checks.
    """
    def process_request(self, request):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                user = get_user_from_access_token(token)
                if user and user.is_active:
                    request.user = user
                    # Disable CSRF for JWT-authenticated requests
                    request._dont_enforce_csrf_checks = True
            except Exception:
                # If token is invalid, let the standard authentication take over
                pass
