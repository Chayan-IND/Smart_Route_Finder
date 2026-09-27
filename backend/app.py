"""
Flask Backend API for Smart Root Finder Using Genetic Algorithm
B.Tech Computer Science / Artificial Intelligence Project
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ga_solver import GeneticAlgorithmSolver

app = Flask(__name__)
# Enable CORS for frontend communication
CORS(app)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "service": "Smart Root Finder GA Backend",
        "version": "1.0.0"
    }), 200


@app.route('/api/find-root', methods=['POST'])
def find_root():
    """
    Main API endpoint for finding an approximate root of an equation using GA.
    
    Request JSON:
    {
        "equation": "x^2 - 4",
        "population_size": 60,
        "generations": 100,
        "mutation_rate": 0.1,
        "search_min": -10.0,
        "search_max": 10.0
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be valid JSON."
        }), 400

    equation_str = data.get("equation", "").strip()
    if not equation_str:
        return jsonify({
            "success": False,
            "error": "Please provide a mathematical equation (e.g., 'x^2 - 4' or 'x² - 5')."
        }), 400

    # Parse and validate optional numeric parameters with safe defaults
    try:
        pop_size = int(data.get("population_size", 60))
        if pop_size < 10 or pop_size > 500:
            return jsonify({
                "success": False,
                "error": "Population size must be between 10 and 500."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Population size must be an integer."}), 400

    try:
        generations = int(data.get("generations", 100))
        if generations < 10 or generations > 500:
            return jsonify({
                "success": False,
                "error": "Generations must be between 10 and 500."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Generations must be an integer."}), 400

    try:
        mutation_rate = float(data.get("mutation_rate", 0.1))
        if mutation_rate < 0.0 or mutation_rate > 1.0:
            return jsonify({
                "success": False,
                "error": "Mutation rate must be between 0.0 and 1.0."
            }), 400
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Mutation rate must be a float between 0.0 and 1.0."}), 400

    try:
        search_min = float(data.get("search_min", -10.0))
        search_max = float(data.get("search_max", 10.0))
        if search_min >= search_max:
            search_min, search_max = -10.0, 10.0
    except (ValueError, TypeError):
        search_min, search_max = -10.0, 10.0

    # Execute the Genetic Algorithm
    try:
        solver = GeneticAlgorithmSolver(
            equation_str=equation_str,
            pop_size=pop_size,
            generations=generations,
            mutation_rate=mutation_rate,
            search_min=search_min,
            search_max=search_max
        )
        result = solver.solve()
        return jsonify(result), 200

    except ValueError as val_err:
        return jsonify({
            "success": False,
            "error": str(val_err)
        }), 400
    except Exception as exc:
        return jsonify({
            "success": False,
            "error": f"Failed to compute root: {str(exc)}"
        }), 500


if __name__ == '__main__':
    # Run Flask on port 5000
    print("Starting Smart Root Finder API on http://127.0.0.1:5000 ...")
    app.run(host='127.0.0.1', port=5000, debug=False)
