"""
Genetic Algorithm Solver for Mathematical Root Finding
Project: Smart Root Finder Using Genetic Algorithm
B.Tech Computer Science / Artificial Intelligence Project
"""

import math
import random
import re
import ast

# Allowed math functions and constants for safe evaluation
SAFE_NAMES = {
    'sin': math.sin,
    'cos': math.cos,
    'tan': math.tan,
    'sqrt': math.sqrt,
    'exp': math.exp,
    'log': math.log,
    'log10': math.log10,
    'abs': abs,
    'pi': math.pi,
    'e': math.e,
}

ALLOWED_NODE_TYPES = (
    ast.Expression,
    ast.BinOp,
    ast.UnaryOp,
    ast.Call,
    ast.Name,
    ast.Constant,
    ast.Add,
    ast.Sub,
    ast.Mult,
    ast.Div,
    ast.FloorDiv,
    ast.Mod,
    ast.Pow,
    ast.USub,
    ast.UAdd,
    ast.Load,
)


def preprocess_equation(raw_eq: str) -> str:
    """
    Cleans and standardizes user equation input.
    Examples:
      'x² - 4' -> 'x**2 - 4'
      'x^2 - 5' -> 'x**2 - 5'
      '2x + 3' -> '2*x + 3'
      'x^2 = 4' -> '(x**2) - (4)'
    """
    eq = raw_eq.strip()
    if not eq:
        raise ValueError("Equation cannot be empty.")

    # If user provided equation with '=', e.g., 'x^2 - 4 = 0' or 'x^2 = 9'
    if '=' in eq:
        parts = eq.split('=', 1)
        lhs = parts[0].strip()
        rhs = parts[1].strip() or '0'
        eq = f"({lhs}) - ({rhs})"

    # Replace unicode powers
    superscripts = {
        '²': '**2',
        '³': '**3',
        '⁴': '**4',
        '⁵': '**5',
        '⁶': '**6',
        '⁷': '**7',
        '⁸': '**8',
        '⁹': '**9',
        '⁰': '**0',
    }
    for sup, repl in superscripts.items():
        eq = eq.replace(sup, repl)

    # Replace caret '^' with '**'
    eq = eq.replace('^', '**')

    # Convert implicit multiplication:
    # e.g., '2x' -> '2*x', '3.5x' -> '3.5*x'
    eq = re.sub(r'(\d+(\.\d+)?)\s*([a-zA-Z(])', r'\1*\3', eq)

    # e.g., ')x' -> ')*x', ')(' -> ')*('
    eq = re.sub(r'\)\s*([a-zA-Z0-9(])', r')*\1', eq)

    # e.g., 'x(' -> 'x*(' (except if function name like sin(, cos(, etc.)
    # Match an 'x' preceded by word boundary and followed by '('
    eq = re.sub(r'\bx\s*\(', 'x*(', eq)

    return eq


def validate_ast(node: ast.AST):
    """
    Recursively validates the AST to ensure only safe mathematical expressions
    and allowed functions/names are present.
    """
    if not isinstance(node, ALLOWED_NODE_TYPES):
        raise ValueError(f"Unsupported syntax or operation: {type(node).__name__}")

    if isinstance(node, ast.Name):
        if node.id != 'x' and node.id not in SAFE_NAMES:
            raise ValueError(f"Unknown variable or function: '{node.id}'. Use 'x' as the variable.")

    if isinstance(node, ast.Call):
        if not isinstance(node.func, ast.Name):
            raise ValueError("Only standard mathematical functions (sin, cos, tan, sqrt, exp, log, abs) are allowed.")
        if node.func.id not in SAFE_NAMES:
            raise ValueError(f"Function '{node.func.id}' is not supported.")

    for child in ast.iter_child_nodes(node):
        validate_ast(child)


def compile_equation(raw_eq: str):
    """
    Parses, validates, and compiles the equation into a safe callable f(x).
    """
    processed_str = preprocess_equation(raw_eq)

    try:
        parsed_ast = ast.parse(processed_str, mode='eval')
    except SyntaxError as e:
        raise ValueError(f"Syntax error in equation: {e.msg}")

    # Validate AST security
    validate_ast(parsed_ast)

    # Compile into bytecode
    compiled_code = compile(parsed_ast, filename="<user_equation>", mode="eval")

    def f(x: float) -> float:
        context = dict(SAFE_NAMES)
        context['x'] = float(x)
        try:
            val = eval(compiled_code, {"__builtins__": {}}, context)
            if isinstance(val, complex):
                return float('inf')
            return float(val)
        except (ZeroDivisionError, OverflowError, ValueError):
            return float('inf')

    # Quick test at x=1.0 to check for runtime evaluation sanity
    try:
        f(1.0)
    except Exception as e:
        raise ValueError(f"Evaluation error on sample input: {str(e)}")

    return f, processed_str


class GeneticAlgorithmSolver:
    """
    Real-Valued Genetic Algorithm for finding the roots of f(x) = 0.
    
    Steps:
    1. Population Initialization: Random uniform values in [search_min, search_max]
    2. Fitness Evaluation: Fitness = 1 / (1 + |f(x)|)
    3. Selection: Tournament Selection (size 3)
    4. Crossover: Arithmetic Blend Crossover
    5. Mutation: Gaussian Random Perturbation
    6. Elitism: Best individuals preserved unchanged
    7. Iteration: Repeat for N generations
    """
    def __init__(
        self,
        equation_str: str,
        pop_size: int = 60,
        generations: int = 100,
        mutation_rate: float = 0.1,
        search_min: float = -10.0,
        search_max: float = 10.0,
        seed: int = None
    ):
        if seed is not None:
            random.seed(seed)

        self.raw_equation = equation_str
        self.f, self.clean_equation = compile_equation(equation_str)
        self.pop_size = max(10, min(int(pop_size), 500))
        self.generations = max(10, min(int(generations), 500))
        self.mutation_rate = max(0.0, min(float(mutation_rate), 1.0))
        self.search_min = float(search_min)
        self.search_max = float(search_max)

        if self.search_min >= self.search_max:
            self.search_min, self.search_max = -10.0, 10.0

    def evaluate_fitness(self, x: float) -> tuple[float, float]:
        """
        Calculates fitness based on how close f(x) is to 0.
        Returns: (fitness, absolute_error)
        Fitness is in (0.0, 1.0], where 1.0 is an exact root.
        """
        fx = self.f(x)
        if math.isinf(fx) or math.isnan(fx):
            return 0.0, float('inf')
        
        error = abs(fx)
        fitness = 1.0 / (1.0 + error)
        return fitness, error

    def tournament_selection(self, population_with_fitness, k=3):
        """
        Selects one individual using tournament selection.
        """
        candidates = random.sample(population_with_fitness, k)
        # Sort candidates by fitness descending
        candidates.sort(key=lambda ind: ind[1], reverse=True)
        return candidates[0][0]

    def crossover(self, parent1: float, parent2: float) -> tuple[float, float]:
        """
        Arithmetic blend crossover producing two offspring.
        """
        alpha = random.random()
        child1 = alpha * parent1 + (1.0 - alpha) * parent2
        child2 = (1.0 - alpha) * parent1 + alpha * parent2
        return child1, child2

    def mutate(self, individual: float) -> float:
        """
        Gaussian mutation with probability mutation_rate.
        """
        if random.random() < self.mutation_rate:
            # Scale mutation step relative to search domain
            sigma = (self.search_max - self.search_min) * 0.1
            perturbed = individual + random.gauss(0, sigma)
            # Clip within search range
            return max(self.search_min, min(self.search_max, perturbed))
        return individual

    def solve(self) -> dict:
        """
        Executes the Genetic Algorithm and records generation history.
        """
        # Step 1: Initialize Population
        population = [
            random.uniform(self.search_min, self.search_max)
            for _ in range(self.pop_size)
        ]

        history = []
        global_best_x = None
        global_best_fitness = -1.0
        global_best_error = float('inf')

        for gen in range(1, self.generations + 1):
            # Step 2: Evaluate Fitness
            scored_population = []
            for ind in population:
                fit, err = self.evaluate_fitness(ind)
                scored_population.append((ind, fit, err))

            # Sort by fitness descending (highest fitness first)
            scored_population.sort(key=lambda item: item[1], reverse=True)

            gen_best_x, gen_best_fitness, gen_best_error = scored_population[0]

            if gen_best_fitness > global_best_fitness:
                global_best_fitness = gen_best_fitness
                global_best_x = gen_best_x
                global_best_error = gen_best_error

            history.append({
                "generation": gen,
                "best_root": round(gen_best_x, 4),
                "fitness": round(gen_best_fitness, 6),
                "error": round(gen_best_error, 6) if not math.isinf(gen_best_error) else 999999.0
            })

            # Check for exact root early exit (e.g. error < 1e-7)
            if global_best_error < 1e-7 and gen >= 15:
                # Fill remaining generations or break
                break

            # Step 3, 4, 5, 6: Elitism + Selection + Crossover + Mutation
            new_generation = []
            # Elitism: retain top 2 individuals directly
            new_generation.append(scored_population[0][0])
            if len(scored_population) > 1:
                new_generation.append(scored_population[1][0])

            # Produce rest of new generation
            while len(new_generation) < self.pop_size:
                p1 = self.tournament_selection(scored_population)
                p2 = self.tournament_selection(scored_population)
                c1, c2 = self.crossover(p1, p2)
                c1 = self.mutate(c1)
                c2 = self.mutate(c2)
                new_generation.append(c1)
                if len(new_generation) < self.pop_size:
                    new_generation.append(c2)

            population = new_generation

        # Calculate final f(x) value
        f_val = self.f(global_best_x)

        return {
            "success": True,
            "raw_equation": self.raw_equation,
            "parsed_equation": self.clean_equation,
            "approximate_root": round(global_best_x, 4),
            "f_at_root": round(f_val, 6) if not math.isinf(f_val) else 0.0,
            "error": round(global_best_error, 6) if not math.isinf(global_best_error) else 999999.0,
            "fitness": round(global_best_fitness, 6),
            "total_generations": len(history),
            "population_size": self.pop_size,
            "mutation_rate": self.mutation_rate,
            "history": history
        }
