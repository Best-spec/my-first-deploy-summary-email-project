import ast
from pathlib import Path


def test_no_print_in_views():
    base_dir = Path(__file__).resolve().parents[1] / "main" / "views"
    for path in base_dir.rglob("*.py"):
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and getattr(getattr(node, "func", None), "id", None) == "print":
                raise AssertionError(f"print statement found in {path}")
