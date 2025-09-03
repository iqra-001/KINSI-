import re

# Password strength checker
def is_strong_password(password: str) -> bool:
    """
    Check if a password is strong:
    - At least 8 characters
    - Contains uppercase, lowercase, digit, and special character
    """
    return (
        len(password) >= 8 and
        re.search(r'[A-Z]', password) and
        re.search(r'[a-z]', password) and
        re.search(r'\d', password) and
        re.search(r'[!@#$%^&*(),.?":{}|<>]', password)
    )

# Email format checker
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
)
# Explanation:
# (- local-part: letters, numbers, ., _, %, +, -) (- domain: letters, numbers, dots, hyphens) (- TLD: at least 2 letters (com, org, net, co.uk, etc.))

def is_valid_email(email: str) -> bool:
    """
    Validate email format using regex.
    Accepts emails like user@gmail.com, john.doe@yahoo.co.uk, etc.
    Rejects invalid ones like user@domain, user@, @domain.com
    """
    return EMAIL_REGEX.match(email) is not None

# Validate incoming user data
def validate_user_data(data: dict, existing_user=None) -> dict:
    """
    Validate registration or profile update data.
    Returns a dict of errors if any.
    """
    errors = {}

    # Validate username
    if "username" in data:
        username = data["username"].strip()
        if len(username) < 3:
            errors["username"] = "Username must be at least 3 characters long."

    # Validate email
    if "email" in data:
        email = data["email"].strip()
        if not is_valid_email(email):
            errors["email"] = (
                "Invalid email format. Please provide a valid email like user@gmail.com."
            )

    # Validate password (only when given, e.g. registration or password change)
    if "password" in data and data["password"]:
        if not is_strong_password(data["password"]):
            errors["password"] = (
                "Password must be at least 8 characters long, include "
                "uppercase, lowercase, a number, and a special character."
            )

    return errors
