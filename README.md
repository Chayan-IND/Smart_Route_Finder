# Smart Root Finder Using Genetic Algorithm

**B.Tech Computer Science / Artificial Intelligence Project**

An interactive web-based root finder that calculates the approximate roots of mathematical equations using a **Real-Valued Genetic Algorithm implemented in Python (Flask)** with a responsive **React (Vite)** frontend.

---

## 👥 Project Team

| Name | Student ID | Department |
| :--- | :--- | :--- |
| **Chayan Choudhury** | `241001001103` | CSE / AI |
| **Soumik Dey** | `241001001033` | CSE / AI |
| **Jyoti Roy** | `241001001093` | CSE / AI |
| **Debnandan Kar** | `241001001063` | CSE / AI |
| **Sharmistha Das** | `241001001117` | CSE / AI |

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

---

### Step 1: Start the Python Flask Backend

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   *The backend will start on `http://127.0.0.1:5000`.*

---

### Step 2: Start the React Frontend

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   **[http://localhost:5173](http://localhost:5173)**

---

## 🧬 How the Genetic Algorithm Works

The algorithm finds the roots ($x$ values where $f(x) \approx 0$) through 7 evolutionary steps:

1. **Population Initialization**: Generates an initial generation of random candidate real numbers within the specified interval $[min\_x, max\_x]$.
2. **Fitness Evaluation**: Each candidate $x$ is substituted into $f(x)$. Fitness is calculated using:
   $$\text{Fitness} = \frac{1}{1 + |f(x)|}$$
   As $f(x) \to 0$, $\text{Fitness} \to 1.0$.
3. **Selection**: Tournament selection picks the best performing individuals from random subsets.
4. **Crossover**: Arithmetic blend crossover combines genetic material from pairs of selected parents.
5. **Mutation**: Gaussian perturbation ($x \leftarrow x + \mathcal{N}(0, \sigma)$) introduces small random changes to prevent premature convergence.
6. **Elitism & New Generation**: The fittest candidates are preserved directly into the next generation.
7. **Best Root Convergence**: The cycle repeats across generations until the population converges to an accurate approximate root.

---

## 🔌 API Reference

### `POST /api/find-root`
Finds an approximate root using the Genetic Algorithm.

**Request Body:**
```json
{
  "equation": "x^2 - 4",
  "population_size": 60,
  "generations": 100,
  "mutation_rate": 0.1,
  "search_min": -10.0,
  "search_max": 10.0
}
```

**Response Body:**
```json
{
  "success": true,
  "raw_equation": "x^2 - 4",
  "parsed_equation": "x**2 - 4",
  "approximate_root": 2.0,
  "f_at_root": 0.0,
  "error": 0.0,
  "fitness": 1.0,
  "total_generations": 100,
  "population_size": 60,
  "mutation_rate": 0.1,
  "history": [
    { "generation": 1, "best_root": 2.145, "fitness": 0.6234, "error": 0.604 },
    ...
  ]
}
```

---

## 📁 Project Architecture

```
AI Project/
├── backend/
│   ├── app.py              # Flask REST API with CORS & input validation
│   ├── ga_solver.py        # Core real-valued Genetic Algorithm engine
│   └── requirements.txt    # Python dependencies (Flask, flask-cors)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with live backend health check
│   │   │   ├── RootFinder.jsx      # Equation input, presets, parameters
│   │   │   ├── ResultCard.jsx      # Root display, verification, metrics
│   │   │   ├── FitnessChart.jsx    # SVG Generation vs Best Fitness chart
│   │   │   ├── HowItWorks.jsx      # 7-step pipeline explanation
│   │   │   ├── PythonCodeSection.jsx # Code viewer & component breakdown
│   │   │   ├── TeamSection.jsx     # Team member details
│   │   │   └── Footer.jsx          # Project footer
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🎓 Viva Preparation Notes

1. **Why use Genetic Algorithms for root finding instead of Newton-Raphson?**
   Newton-Raphson requires calculating derivatives $f'(x)$ and can fail if $f'(x) = 0$ or for non-differentiable equations. Genetic Algorithms are derivative-free global optimizers that work across rugged, non-linear, or complex objective spaces.
2. **What does a fitness value of 1.0 mean?**
   Since $\text{Fitness} = \frac{1}{1 + |f(x)|}$, a fitness of $1.0$ occurs when $|f(x)| = 0$, meaning an exact mathematical root has been found.
3. **What is Elitism?**
   Elitism guarantees that the best individual of the current generation is copied unchanged into the next generation so that the best solution found never deteriorates over time.
