from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError

User = get_user_model()


def authenticate_user(username, password):
    return authenticate(username=username, password=password)


def create_token_pair(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def refresh_token(refresh_token):
    try:
        refresh = RefreshToken(refresh_token)
        return {
            'access': str(refresh.access_token),
        }
    except TokenError as exc:
        raise ValueError(str(exc))


def get_user_from_access_token(token):
    jwt_auth = JWTAuthentication()
    validated_token = jwt_auth.get_validated_token(token)
    return jwt_auth.get_user(validated_token)


def decode_token(token):
    jwt_auth = JWTAuthentication()
    return jwt_auth.get_validated_token(token)
