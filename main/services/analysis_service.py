"""Service layer for analysis request processing."""

from main.views.constants import ANALYSIS_ACTIONS


def perform_analysis(action_id, date, web_commerce=None):
    """Execute the selected analysis action and return its result."""
    action = ANALYSIS_ACTIONS.get(action_id)
    if not action:
        raise ValueError(f'Invalid action_id: {action_id}')

    func = action.get('function')
    if not func:
        raise ValueError(f'No function defined for {action_id}')

    if action_id == 'total-month':
        return func(date, web_commerce)

    return func(date)
