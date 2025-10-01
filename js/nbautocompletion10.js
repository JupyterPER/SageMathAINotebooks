// ======================
// ENHANCED CODEMIRROR MANAGEMENT WITH NAVIGATION
// ======================

window.allCodeMirrors = [];

function refreshAllCodeMirrors() {
    window.allCodeMirrors = Array
        .from(document.querySelectorAll('.CodeMirror'))
        .map(el => el.CodeMirror)
        .filter(cm => {
            if (!cm || !cm.getWrapperElement().isConnected) return false;
            const style = window.getComputedStyle(cm.getWrapperElement());
            return style.display !== "none" && style.visibility !== "hidden";
        });
}

function getAllEditors() {
    refreshAllCodeMirrors();
    return window.allCodeMirrors;
}

// ======================
// NAVIGATION FUNCTIONS
// ======================

function focusRelativeCodeMirror(currentCm, direction) {
    const mirrors = getAllEditors();
    const index = mirrors.indexOf(currentCm);
    if (index === -1) return;

    let targetIndex = index + direction;
    if (targetIndex < 0) targetIndex = mirrors.length - 1; // Wrap to last
    if (targetIndex >= mirrors.length) targetIndex = 0;    // Wrap to first

    const target = mirrors[targetIndex];
    target.focus();
    
    // Position cursor at end of content for better UX
    const lastLine = target.lastLine();
    const lastChar = target.getLine(lastLine).length;
    target.setCursor(lastLine, lastChar);
    
    target.getWrapperElement()
          .scrollIntoView({ behavior: "smooth", block: "center" });
}

function addNavigationKeys(cm) {
    if (cm.__hasNavKeys) return;

    cm.addKeyMap({
        "Ctrl-Up": function(cm) { focusRelativeCodeMirror(cm, -1); },
        "Ctrl-Down": function(cm) { focusRelativeCodeMirror(cm, +1); }
    });

    cm.__hasNavKeys = true;
}

// ======================
// ENHANCED AUTOCOMPLETION
// ======================

function enhanceSageCellsWithGlobalAutocomplete() {
    // Basic Python and SageMath completions (keep your existing staticCompletions array)
    const staticCompletions = [
        // Basic Python keywords
        { text: "def", displayText: "def function_name(arguments): - Define a function" },
        { text: "class", displayText: "class ClassName: - Define a class" },
        { text: "import", displayText: "import module - Import a module" },
        { text: "from", displayText: "from module import name - Import specific parts" },
        { text: "return", displayText: "return value - Return a value from a function" },
        { text: "if", displayText: "if condition: - Conditional statement" },
        { text: "elif", displayText: "elif condition: - Else if condition" },
        { text: "else", displayText: "else: - Else clause" },
        { text: "for", displayText: "for item in iterable: - For loop" },
        { text: "while", displayText: "while condition: - While loop" },
        { text: "try", displayText: "try: - Try block for exceptions" },
        { text: "except", displayText: "except Exception: - Catch exceptions" },
        { text: "finally", displayText: "finally: - Finally block for cleanup" },
        { text: "with", displayText: "with expression as variable: - Context manager" },
        { text: "lambda", displayText: "lambda arguments: expression - Anonymous function" },
        { text: "print(", displayText: "print(value) - Display output to the console" },
        { text: "len(", displayText: "len(sequence) - Return the length of a sequence" },
        { text: "range(", displayText: "range(stop) or range(start, stop, step) - Generate a sequence of numbers" },
        { text: "list(", displayText: "list(iterable) - Create a list or convert to a list" },
        { text: "tuple(", displayText: "tuple(iterable) - Create a tuple or convert to a tuple" },
        { text: "dict(", displayText: "dict(mapping) - Create a dictionary" },
        { text: "set(", displayText: "set(iterable) - Create a set of unique values" },
        { text: "str(", displayText: "str(object) - Convert object to a string" },
        { text: "int(", displayText: "int(x) - Convert x to an integer" },
        { text: "float(", displayText: "float(x) - Convert x to a floating point number" },
        { text: "bool(", displayText: "bool(x) - Convert x to a Boolean value" },
        { text: "type(", displayText: "type(object) - Return the type of an object" },
        { text: "abs(", displayText: "abs(x) - Return the absolute value of a number" },
        { text: "enumerate(", displayText: "enumerate(iterable) - Return index, value pairs" },
        { text: "zip(", displayText: "zip(iter1, iter2, ...) - Combine iterables into tuples" },
        { text: "map(", displayText: "map(function, iterable) - Apply function to each item" },
        { text: "filter(", displayText: "filter(function, iterable) - Filter items based on function" },
        { text: "sum(", displayText: "sum(iterable) - Sum all items in an iterable" },
        { text: "max(", displayText: "max(iterable) - Return the largest item" },
        { text: "min(", displayText: "min(iterable) - Return the smallest item" },
        { text: "sorted(", displayText: "sorted(iterable) - Return a sorted list" },
        { text: "reversed(", displayText: "reversed(sequence) - Return a reversed iterator" },
        { text: "all(", displayText: "all(iterable) - Return True if all elements are true" },
        { text: "any(", displayText: "any(iterable) - Return True if any element is true" },
        { text: "round(", displayText: "round(number[, ndigits]) - Round a number to ndigits" },
        { text: "pow(", displayText: "pow(x, y) - Return x to the power y" },

        // List methods from the book
        { text: ".append(", displayText: ".append(item) - Add an item to the end of a list" },
        { text: ".extend(", displayText: ".extend(iterable) - Add elements from iterable to a list" },
        { text: ".insert(", displayText: ".insert(i, x) - Insert an item at a position" },
        { text: ".remove(", displayText: ".remove(item) - Remove first occurrence of an item" },
        { text: ".pop(", displayText: ".pop([i]) - Remove and return item at index i" },
        { text: ".clear(", displayText: ".clear() - Remove all items from list" },
        { text: ".index(", displayText: ".index(item) - Index of first occurrence of item" },
        { text: ".count(", displayText: ".count(item) - Count occurrences of an item" },
        { text: ".sort(", displayText: ".sort() - Sort the list in-place" },
        { text: ".reverse(", displayText: ".reverse() - Reverse the list in-place" },
        { text: ".copy(", displayText: ".copy() - Return a shallow copy of the list" },

        // String methods from the book
        { text: ".upper(", displayText: ".upper() - Convert string to uppercase" },
        { text: ".lower(", displayText: ".lower() - Convert string to lowercase" },
        { text: ".title(", displayText: ".title() - Capitalize first letter of each word" },
        { text: ".capitalize(", displayText: ".capitalize() - Capitalize first letter of string" },
        { text: ".strip(", displayText: ".strip([chars]) - Remove leading and trailing whitespace" },
        { text: ".lstrip(", displayText: ".lstrip([chars]) - Remove leading whitespace" },
        { text: ".rstrip(", displayText: ".rstrip([chars]) - Remove trailing whitespace" },
        { text: ".find(", displayText: ".find(sub) - Find substring, return index or -1" },
        { text: ".replace(", displayText: ".replace(old, new) - Replace occurrences of substring" },
        { text: ".split(", displayText: ".split([sep]) - Split string by separator into list" },
        { text: ".join(", displayText: ".join(iterable) - Join elements with string as separator" },
        { text: ".format(", displayText: ".format(*args) - Format string with placeholders" },
        { text: ".startswith(", displayText: ".startswith(prefix) - Check if string starts with prefix" },
        { text: ".endswith(", displayText: ".endswith(suffix) - Check if string ends with suffix" },

        // Dictionary methods
        { text: ".keys(", displayText: ".keys() - Return a view of dictionary's keys" },
        { text: ".values(", displayText: ".values() - Return a view of dictionary's values" },
        { text: ".items(", displayText: ".items() - Return a view of dictionary's key-value pairs" },
        { text: ".get(", displayText: ".get(key[, default]) - Return value for key, or default" },
        { text: ".update(", displayText: ".update([other]) - Update dictionary with items from other" },
        { text: ".pop(", displayText: ".pop(key[, default]) - Remove key and return its value" },

        // Set operations
        { text: ".add(", displayText: ".add(elem) - Add element to set" },
        { text: ".remove(", displayText: ".remove(elem) - Remove element from set" },
        { text: ".union(", displayText: ".union(other_set) - Return union of sets" },
        { text: ".intersection(", displayText: ".intersection(other_set) - Return intersection of sets" },
        { text: ".difference(", displayText: ".difference(other_set) - Return difference of sets" },

        // Control flow helpers
        { text: "break", displayText: "break - Exit the current loop" },
        { text: "continue", displayText: "continue - Skip the current iteration and continue with the next" },
        { text: "pass", displayText: "pass - Do nothing placeholder" },

        // File operations
        { text: "open(", displayText: "open(file, mode) - Open a file and return a file object" },
        { text: ".read(", displayText: ".read([size]) - Read from file" },
        { text: ".write(", displayText: ".write(str) - Write string to file" },
        { text: ".close(", displayText: ".close() - Close file" },

        // Exception handling
        { text: "raise", displayText: "raise Exception('message') - Raise an exception" },

        // Import helpers for data science
        { text: "import numpy as np", displayText: "import numpy as np - Import NumPy with standard alias" },
        { text: "import pandas as pd", displayText: "import pandas as pd - Import Pandas with standard alias" },
        { text: "import matplotlib.pyplot as plt", displayText: "import matplotlib.pyplot as plt - Import Matplotlib plotting" },

        // NumPy basics from the book
        { text: "np.array(", displayText: "np.array(object) - Create a NumPy array" },
        { text: "np.arange(", displayText: "np.arange([start,] stop[, step]) - Evenly spaced values" },
        { text: "np.linspace(", displayText: "np.linspace(start, stop, num) - Evenly spaced values in interval" },
        { text: "np.zeros(", displayText: "np.zeros(shape) - Array of zeros" },
        { text: "np.ones(", displayText: "np.ones(shape) - Array of ones" },
        { text: "np.random.random(", displayText: "np.random.random(size) - Random values in [0.0, 1.0)" },
        { text: "np.dot(", displayText: "np.dot(a, b) - Dot product of two arrays" },
        { text: "np.sin(", displayText: "np.sin(x) - Sine of x" },
        { text: "np.cos(", displayText: "np.cos(x) - Cosine of x" },
        { text: "np.pi", displayText: "np.pi - Mathematical constant π" },

        // Pandas basics from the book
        { text: "pd.DataFrame(", displayText: "pd.DataFrame(data) - Create a DataFrame" },
        { text: "pd.Series(", displayText: "pd.Series(data) - Create a Series" },
        { text: ".groupby(", displayText: ".groupby(by) - Group DataFrame by values" },

        // Matplotlib basics from the book
        { text: "plt.plot(", displayText: "plt.plot(x, y) - Plot y versus x as lines/markers" },
        { text: "plt.figure(", displayText: "plt.figure() - Create a new figure" },
        { text: "plt.title(", displayText: "plt.title(label) - Add a title to the current axes" },
        { text: "plt.xlabel(", displayText: "plt.xlabel(xlabel) - Set the label for the x-axis" },
        { text: "plt.ylabel(", displayText: "plt.ylabel(ylabel) - Set the label for the y-axis" },
        { text: "plt.show(", displayText: "plt.show() - Display all open figures" },

        // SageMath basic keywords

        // Trigonometric functions
        { text: "sin(", displayText: "sin(x) - Sine function" },
        { text: "cos(", displayText: "cos(x) - Cosine function" },
        { text: "tan(", displayText: "tan(x) - Tangent function" },
        { text: "sec(", displayText: "sec(x) - Secant function" },
        { text: "csc(", displayText: "csc(x) - Cosecant function" },
        { text: "cot(", displayText: "cot(x) - Cotangent function" },

        // Inverse trigonometric functions
        { text: "arcsin(", displayText: "arcsin(x) - Inverse sine function" },
        { text: "arccos(", displayText: "arccos(x) - Inverse cosine function" },
        { text: "arctan(", displayText: "arctan(x) - Inverse tangent function" },
        { text: "arctan2(", displayText: "arctan2(y, x) - Two-argument inverse tangent" },
        { text: "arcsec(", displayText: "arcsec(x) - Inverse secant function" },
        { text: "arccsc(", displayText: "arccsc(x) - Inverse cosecant function" },
        { text: "arccot(", displayText: "arccot(x) - Inverse cotangent function" },

        // Hyperbolic functions
        { text: "sinh(", displayText: "sinh(x) - Hyperbolic sine function" },
        { text: "cosh(", displayText: "cosh(x) - Hyperbolic cosine function" },
        { text: "tanh(", displayText: "tanh(x) - Hyperbolic tangent function" },
        { text: "sech(", displayText: "sech(x) - Hyperbolic secant function" },
        { text: "csch(", displayText: "csch(x) - Hyperbolic cosecant function" },
        { text: "coth(", displayText: "coth(x) - Hyperbolic cotangent function" },

        // Inverse hyperbolic functions
        { text: "arcsinh(", displayText: "arcsinh(x) - Inverse hyperbolic sine" },
        { text: "arccosh(", displayText: "arccosh(x) - Inverse hyperbolic cosine" },
        { text: "arctanh(", displayText: "arctanh(x) - Inverse hyperbolic tangent" },
        { text: "arcsech(", displayText: "arcsech(x) - Inverse hyperbolic secant" },
        { text: "arccsch(", displayText: "arccsch(x) - Inverse hyperbolic cosecant" },
        { text: "arccoth(", displayText: "arccoth(x) - Inverse hyperbolic cotangent" },

        // Exponential and logarithmic functions
        { text: "exp(", displayText: "exp(x) - Exponential function (e^x)" },
        { text: "log(", displayText: "log(x) - Natural logarithm (base e)" },
        { text: "log(", displayText: "log(x, 10) - Base 10 logarithm" },
        { text: "log(", displayText: "log(x, 2) - Base 2 logarithm" },
        { text: "sqrt(", displayText: "sqrt(x) - Square root of x" },

        // Power functions
        { text: "pow(", displayText: "pow(x, y) - x raised to power y" },
        { text: "abs(", displayText: "abs(x) - Absolute value" },
        { text: "sign(", displayText: "sign(x) - Sign function (-1, 0, or 1)" },

        // Rounding functions
        { text: "floor(", displayText: "floor(x) - Round down to nearest integer" },
        { text: "ceil(", displayText: "ceil(x) - Round up to nearest integer" },
        { text: "round(", displayText: "round(x, n) - Round to n decimal places" },
        { text: "trunc(", displayText: "trunc(x) - Truncate decimal part" },

        // Basic arithmetic and elementary operations
        { text: "factorial(", displayText: "factorial(n) - Compute n!" },
        { text: "binomial(", displayText: "binomial(n,k) - Compute binomial coefficient (n choose k)" },
        { text: "numerical_approx(", displayText: "numerical_approx(expr, digits=n) - Numerical approximation" },
        { text: "n(", displayText: "n(expr, digits=n) - Shorthand for numerical_approx()" },

        // Constants
        { text: "pi", displayText: "pi - Mathematical constant π" },
        { text: "e", displayText: "e - Mathematical constant e (base of natural logarithm)" },
        { text: "I", displayText: "I - Imaginary unit i" },
        { text: "infinity", displayText: "infinity - Mathematical infinity ∞" },
        { text: "oo", displayText: "oo - Alternative notation for infinity" },

        // Symbolic computation
        { text: "var(", displayText: "var('x y z') - Define symbolic variables" },
        { text: "function(", displayText: "function('f')(x) - Define a symbolic function" },
        { text: "solve(", displayText: "solve(equation, variable) - Solve an equation" },
        { text: "find_root(", displayText: "find_root(expression, a, b) - Find numerical root in interval [a,b]" },
        { text: "expand(", displayText: "expand(expr) - Expand an expression" },
        { text: "factor(", displayText: "factor(expr) - Factor an expression" },
        { text: "simplify(", displayText: "simplify(expr) - Simplify an expression" },
        { text: "simplify_full(", displayText: "simplify_full(expr) - Apply multiple simplification methods" },
        { text: "simplify_trig(", displayText: "simplify_trig(expr) - Simplify trigonometric expressions" },
        { text: "collect(", displayText: "collect(expr, var) - Collect terms with the same power of var" },

        // Calculus
        { text: "diff(", displayText: "diff(f, x) - Differentiate f with respect to x" },
        { text: "derivative(", displayText: "derivative(f, x) - Synonym for diff()" },
        { text: "integral(", displayText: "integral(f, x) - Indefinite integral of f with respect to x" },
        { text: "integrate(", displayText: "integrate(f, x, a, b) - Definite integral from a to b" },
        { text: "integral_numerical(", displayText: "integral_numerical(f, a, b) - Numerical integration" },
        { text: "limit(", displayText: "limit(f, x=a) - Compute the limit of f as x approaches a" },
        { text: "taylor(", displayText: "taylor(f, x, a, n) - Taylor expansion of f around a to order n" },
        { text: "sum(", displayText: "sum(expression, variable, lower, upper) - Compute a sum" },

        // Plotting
        { text: "plot(", displayText: "plot(f, xmin, xmax) - Create a 2D plot" },
        { text: "plot3d(", displayText: "plot3d(f, xmin, xmax, ymin, ymax) - Create a 3D plot" },
        { text: "parametric_plot(", displayText: "parametric_plot((fx,fy), (t,a,b)) - Parametric plot" },
        { text: "polar_plot(", displayText: "polar_plot(f, theta_min, theta_max) - Polar plot" },
        { text: "list_plot(", displayText: "list_plot(points) - Plot a list of points" },
        { text: "contour_plot(", displayText: "contour_plot(f, (x,a,b), (y,c,d)) - Contour plot" },
        { text: "implicit_plot(", displayText: "implicit_plot(f, (x,a,b), (y,c,d)) - Implicit plot" },
        { text: "region_plot(", displayText: "region_plot(f, (x,a,b), (y,c,d)) - Region plot" },
        { text: "arrow(", displayText: "arrow((x1,y1), (x2,y2)) - Plot an arrow" },
        { text: "line(", displayText: "line([(x1,y1), (x2,y2)]) - Plot a line" },
        { text: "circle(", displayText: "circle((x,y), r) - Plot a circle" },
        { text: "text(", displayText: "text(\"msg\", (x,y)) - Add text to a plot" },

        // Linear Algebra
        { text: "matrix(", displayText: "matrix([[a,b],[c,d]]) - Create a matrix" },
        { text: "identity_matrix(", displayText: "identity_matrix(n) - Create n×n identity matrix" },
        { text: "zero_matrix(", displayText: "zero_matrix(ring, rows, cols) - Create zero matrix" },
        { text: "random_matrix(", displayText: "random_matrix(ring, rows, cols) - Create random matrix" },
        { text: "vector(", displayText: "vector([a,b,c]) - Create a vector" },
        { text: "MatrixSpace(", displayText: "MatrixSpace(ring, rows, cols) - Create a matrix space" },

        // Number Theory
        { text: "is_prime(", displayText: "is_prime(n) - Test if n is prime" },
        { text: "is_pseudoprime(", displayText: "is_pseudoprime(n) - Fast primality test" },
        { text: "next_prime(", displayText: "next_prime(n) - Next prime after n" },
        { text: "prime_range(", displayText: "prime_range(n) - List of primes up to n" },
        { text: "factor(", displayText: "factor(n) - Prime factorization of n" },
        { text: "euler_phi(", displayText: "euler_phi(n) - Euler's totient function" },
        { text: "gcd(", displayText: "gcd(a,b) - Greatest common divisor" },
        { text: "lcm(", displayText: "lcm(a,b) - Least common multiple" },
        { text: "xgcd(", displayText: "xgcd(a,b) - Extended GCD (returns gcd,s,t where as+bt=gcd)" },

        // Polynomial tools
        { text: "PolynomialRing(", displayText: "PolynomialRing(R, 'x') - Create polynomial ring" },
        { text: "polygen(", displayText: "polygen(QQ, 'x') - Create polynomial generator" },
        { text: "cyclotomic_polynomial(", displayText: "cyclotomic_polynomial(n) - Cyclotomic polynomial" },

        // Finite fields/rings and modular arithmetic
        { text: "Integers(", displayText: "Integers(n) - Ring of integers modulo n" },
        { text: "IntegerModRing(", displayText: "IntegerModRing(n) - Same as Integers(n)" },
        { text: "GF(", displayText: "GF(p) - Finite field with p elements (p prime)" },
        { text: "Mod(", displayText: "Mod(a, n) - Create the element a modulo n" },

        // Sets
        { text: "Set(", displayText: "Set([a,b,c]) - Create a mathematical set" },

        // Basic number fields and domains
        { text: "ZZ", displayText: "ZZ - Ring of integers Z" },
        { text: "QQ", displayText: "QQ - Field of rational numbers Q" },
        { text: "RR", displayText: "RR - Field of real numbers (default precision)" },
        { text: "CC", displayText: "CC - Field of complex numbers (default precision)" },
        { text: "QQbar", displayText: "QQbar - Field of algebraic numbers" },
        { text: "AA", displayText: "AA - Field of algebraic reals" },

        // Statistics
        { text: "mean(", displayText: "mean(data) - Mean of a dataset" },
        { text: "median(", displayText: "median(data) - Median of a dataset" },
        { text: "std(", displayText: "std(data) - Standard deviation" },
        { text: "variance(", displayText: "variance(data) - Variance of a dataset" },
        { text: "correlation(", displayText: "correlation(x, y) - Correlation coefficient" },
        { text: "covariance(", displayText: "covariance(x, y) - Covariance of two datasets" },
        { text: "linear_regression(", displayText: "linear_regression(data) - Linear regression model" },
        { text: "find_fit(", displayText: "find_fit(data, model, initial_guess=None) - Finds parameters to fit data to model" },
        { text: "random()", displayText: "random() - Random value between 0 and 1" },
        { text: "random_vector(", displayText: "random_vector(n) - Random vector of length n" },
        { text: "histogram(", displayText: "histogram(data, bins) - Create a histogram" },

        // Differential Equations
        { text: "desolve(", displayText: "desolve(equation, y, x) - Solve differential equation" },
        { text: "desolve_system(", displayText: "desolve_system(system, [vars], x) - Solve system of ODEs" },
        { text: "desolve_laplace(", displayText: "desolve_laplace(equation, y, x) - Solve ODE using Laplace" },
        { text: "desolve_rk4(", displayText: "desolve_rk4(equation, y, x, ics) - Numerical Runge-Kutta" },

    ];

    // Function to extract user-defined variables from a single editor content
    function extractUserDefinedVariablesFromContent(content, cellId) {
        const lines = content.split('\n');
        const variables = [];

        // Regular expressions for different variable definition patterns
        const patternAssignment = /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)/; // x = value
        const patternForLoop = /^\s*for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+/; // for x in ...
        const patternFunctionDef = /^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/; // def function_name(
        const patternFunctionParams = /^\s*def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(([^)]*)\)/; // parameters in def func(a, b, c):
        const patternVarFunc = /^\s*var\s*\(\s*['"]([^'"]+)['"]\s*\)/; // var('x y z') or var('x, y, z')
        const patternMathFunctionDef = /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*=\s*/; // f(x) = x^2
        const patternLambdaFunc = /^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*lambda\s+([^:]+):/; // f = lambda x, y: x + y

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check for variable assignments
            let match = line.match(patternAssignment);
            if (match && match[2]) {
                // Exclude lambda functions which are handled separately
                if (!line.includes('lambda')) {
                    variables.push({
                        text: match[2],
                        displayText: `${match[2]} - Variable from cell [${cellId}] line ${i+1}`
                    });
                }
            }

            // Check for loop variables
            match = line.match(patternForLoop);
            if (match && match[1]) {
                variables.push({
                    text: match[1],
                    displayText: `${match[1]} - Loop variable from cell [${cellId}] line ${i+1}`
                });
            }

            // Check for function names defined with def
            match = line.match(patternFunctionDef);
            if (match && match[1]) {
                variables.push({
                    text: match[1] + "(",
                    displayText: `${match[1]}() - Function from cell [${cellId}] line ${i+1}`
                });
            }

            // Check for function parameters
            match = line.match(patternFunctionParams);
            if (match && match[1]) {
                const params = match[1].split(',');
                params.forEach(param => {
                    const trimmedParam = param.trim().split('=')[0].trim();
                    if (trimmedParam && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedParam)) {
                        variables.push({
                            text: trimmedParam,
                            displayText: `${trimmedParam} - Function parameter from cell [${cellId}] line ${i+1}`
                        });
                    }
                });
            }

            // Check for variables defined using var() function
            match = line.match(patternVarFunc);
            if (match && match[1]) {
                // Handle both space-separated and comma-separated variable lists
                // First replace all commas with spaces, then split by spaces
                const varNameString = match[1].replace(/,/g, ' ');
                const varNames = varNameString.split(/\s+/);

                varNames.forEach(varName => {
                    // Make sure it's a valid variable name
                    if (varName.trim() && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName.trim())) {
                        variables.push({
                            text: varName.trim(),
                            displayText: `${varName.trim()} - Symbolic variable from cell [${cellId}] line ${i+1}`
                        });
                    }
                });
            }

            // Check for mathematical-style function definitions like f(x) = x^2
            match = line.match(patternMathFunctionDef);
            if (match && match[2]) {
                const funcName = match[2];
                const params = match[3] ? match[3].split(',').map(p => p.trim()) : [];

                // Add the function
                variables.push({
                    text: funcName + "(",
                    displayText: `${funcName}(${params.join(', ')}) - Function from cell [${cellId}] line ${i+1}`
                });

                // Also add the parameters as variables
                params.forEach(param => {
                    if (param && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(param)) {
                        variables.push({
                            text: param,
                            displayText: `${param} - Parameter in function ${funcName} from cell [${cellId}] line ${i+1}`
                        });
                    }
                });
            }

            // Check for lambda function definitions
            match = line.match(patternLambdaFunc);
            if (match && match[2] && match[3]) {
                const funcName = match[2];
                const params = match[3].split(',').map(p => p.trim());

                // Add the function
                variables.push({
                    text: funcName + "(",
                    displayText: `${funcName}(${params.join(', ')}) - Lambda function from cell [${cellId}] line ${i+1}`
                });

                // Add lambda parameters
                params.forEach(param => {
                    if (param && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(param)) {
                        variables.push({
                            text: param,
                            displayText: `${param} - Lambda parameter in ${funcName} from cell [${cellId}] line ${i+1}`
                        });
                    }
                });
            }
        }

        return variables;
    }

    // Function to gather variables from all SageCell CodeMirror instances
    function gatherAllUserDefinedVariables() {
        const allVariables = [];
        const cmEditors = document.querySelectorAll('.sagecell .CodeMirror.cm-s-default');

        cmEditors.forEach((cmElement, index) => {
            const cmInstance = cmElement.CodeMirror;
            if (cmInstance) {
                const content = cmInstance.getValue();
                const cellId = index + 1;
                const cellVariables = extractUserDefinedVariablesFromContent(content, cellId);
                allVariables.push(...cellVariables);
            }
        });

        return allVariables;
    }

    // Register autocomplete helper
    function registerAutocompleteHelper() {
        if (CodeMirror.hint && !CodeMirror.hint.__sageHelperInstalled) {
            CodeMirror.registerHelper("hint", "python", function(editor, options) {
                const cursor = editor.getCursor();
                const line = editor.getLine(cursor.line);
                const lineStartToCursor = line.slice(0, cursor.ch);

                let wordStart = lineStartToCursor.search(/[\w\.][\w\.]*$/);
                if (wordStart === -1) wordStart = cursor.ch;

                const currentWord = lineStartToCursor.slice(wordStart);
                const allUserVariables = gatherAllUserDefinedVariables();
                const allCompletions = [...staticCompletions, ...allUserVariables];

                const matchingCompletions = allCompletions.filter(function(completion) {
                    return completion.text.toLowerCase().startsWith(currentWord.toLowerCase());
                }).sort((a, b) => {
                    return a.text.length - b.text.length;
                });

                // Remove duplicates
                const uniqueCompletions = [];
                const seenTexts = new Set();

                for (const completion of matchingCompletions) {
                    if (!seenTexts.has(completion.text)) {
                        seenTexts.add(completion.text);
                        uniqueCompletions.push(completion);
                    }
                }

                return {
                    list: uniqueCompletions,
                    from: CodeMirror.Pos(cursor.line, wordStart),
                    to: cursor
                };
            });
            CodeMirror.hint.__sageHelperInstalled = true;
        }
    }

    function addAutocompleteKeys(cm) {
        if (cm.__hasAutocomplete) return;

        registerAutocompleteHelper();

        cm.addKeyMap({
            "Ctrl-Space": function(cm) {
                cm.showHint({ hint: CodeMirror.hint.python, completeSingle: false });
            }
        });

        cm.__hasAutocomplete = true;
    }

    function addCellOperationShortcuts(cm) {
        if (cm.__hasCellOps) return;
        
        cm.addKeyMap({
            // Add new cell above (Alt+A)
            "Alt-A": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell, .nb-markdown-cell');
                if (cell) {
                    addCell(cell, 'above');
                }
            },
            
            // Add new cell below (Alt+B)
            "Alt-B": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell, .nb-markdown-cell');
                if (cell) {
                    addCell(cell, 'below');
                }
            },

            // Move cell up (Alt+Up)
            "Alt-Up": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-cell');
                
                if (cell && cell.previousElementSibling) {
                    moveCell(cell, 'up');
                    
                    // Refocus the editor after move
                    setTimeout(() => {
                        const movedCM = cell.querySelector('.CodeMirror');
                        if (movedCM && movedCM.CodeMirror) {
                            movedCM.CodeMirror.focus();
                        }
                    }, 100);
                }
            },

            // Move cell down (Alt-Down)
            "Alt-Down": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-cell');
                
                if (cell && cell.nextElementSibling) {
                    moveCell(cell, 'down');
                    
                    // Refocus the editor after move
                    setTimeout(() => {
                        const movedCM = cell.querySelector('.CodeMirror');
                        if (movedCM && movedCM.CodeMirror) {
                            movedCM.CodeMirror.focus();
                        }
                    }, 100);
                }
            },

            // Convert to markdown cell (Alt+M)
            "Alt-M": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell');
                
                if (cell && cell.classList.contains('nb-code-cell')) {
                    // Find position of current cell
                    const allCells = Array.from(document.querySelectorAll('.nb-cell'));
                    const cellIndex = allCells.indexOf(cell);
                    
                    convertToMarkdown(cell);
                    
                    // Focus the new editor at the same position
                    setTimeout(() => {
                        const newAllCells = Array.from(document.querySelectorAll('.nb-cell'));
                        const newCell = newAllCells[cellIndex];
                        
                        if (newCell) {
                            const newCM = newCell.querySelector('.CodeMirror');
                            if (newCM && newCM.CodeMirror) {
                                newCM.CodeMirror.focus();
                            }
                        }
                    }, 700);
                }
            },

            // Convert to code cell (Alt+C)
            "Alt-C": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-markdown-cell');
                
                if (cell && cell.classList.contains('nb-markdown-cell')) {
                    // Find position of current cell
                    const allCells = Array.from(document.querySelectorAll('.nb-cell'));
                    const cellIndex = allCells.indexOf(cell);
                    
                    convertToCode(cell);
                    
                    // Focus the new editor at the same position
                    setTimeout(() => {
                        const newAllCells = Array.from(document.querySelectorAll('.nb-cell'));
                        const newCell = newAllCells[cellIndex];
                        
                        if (newCell) {
                            const newCM = newCell.querySelector('.CodeMirror');
                            if (newCM && newCM.CodeMirror) {
                                newCM.CodeMirror.focus();
                            }
                        }
                    }, 700);
                }
            },
            
            // Run current cell (Ctrl+Enter)
            "Ctrl-Enter": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell');
                if (cell) {
                    const executeButton = cell.querySelector('.sagecell_evalButton');
                    if (executeButton) {
                        executeButton.click();
                    }
                }
            },
            
            // Run current cell and move to next (Shift+Enter)
            "Shift-Enter": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell');
                if (cell) {
                    const executeButton = cell.querySelector('.sagecell_evalButton');
                    if (executeButton) {
                        executeButton.click();
                    }
                    // Move focus to next cell
                    setTimeout(() => {
                        focusRelativeCodeMirror(cm, 1);
                    }, 500);
                }
            },
        
        // Delete with confirmation (Alt+D)
        "Alt-D": function(cm) {
            const wrapper = cm.getWrapperElement();
            const cell = wrapper.closest('.nb-code-cell, .nb-markdown-cell');
            if (cell) {
                // Get some content preview for confirmation
                const content = cm.getValue();
                const preview = content.substring(0, 50) + (content.length > 50 ? '...' : '');
                
                if (confirm(`Are you sure you want to delete this cell? This action cannot be undone.\n\nPreview: "${preview}"`)) {
                    // Same logic as Alt-D
                    const allCells = Array.from(document.querySelectorAll('.nb-code-cell, .nb-markdown-cell'));
                    const currentIndex = allCells.indexOf(cell);
                    let targetCell = null;
                    
                    if (currentIndex < allCells.length - 1) {
                        targetCell = allCells[currentIndex + 1];
                    } else if (currentIndex > 0) {
                        targetCell = allCells[currentIndex - 1];
                    }
                    
                    deleteCell(cell);
                    
                    if (targetCell) {
                        setTimeout(() => {
                            const targetCM = targetCell.querySelector('.CodeMirror');
                            if (targetCM && targetCM.CodeMirror) {
                                targetCM.CodeMirror.focus();
                                targetCM.CodeMirror.setCursor(0, 0);
                            }
                        }, 500);
                    }
                }
            }
        },

        // Duplicate current cell (Alt+C)
        "Alt-V": function(cm) {
            const wrapper = cm.getWrapperElement();
            const cell = wrapper.closest('.nb-code-cell, .nb-markdown-cell');
            if (cell) {
                // Save current cursor position
                const cursorPos = cm.getCursor();
                const scrollInfo = cm.getScrollInfo();
                
                // Use your existing duplicateCell function
                duplicateCell(cell);
                
                // Stay in the original cell and maintain cursor position
                setTimeout(() => {
                    cm.focus();
                    cm.setCursor(cursorPos);
                    cm.scrollTo(scrollInfo.left, scrollInfo.top);
                }, 300);
            }
        },
        
        
            
            // Run current cell and add new cell below (Alt+Enter)
            "Alt-Enter": function(cm) {
                const wrapper = cm.getWrapperElement();
                const cell = wrapper.closest('.nb-code-cell');
                if (cell) {
                    const executeButton = cell.querySelector('.sagecell_evalButton');
                    if (executeButton) {
                        executeButton.click();
                    }
                    // Add new cell below
                    setTimeout(() => {
                        addCell(cell, 'below');
                    }, 500);
                }
            }
        });
        
        cm.__hasCellOps = true;
    }

    

    // ======================
    // ENHANCEMENT LOGIC
    // ======================

    function enhanceEditor(cm) {
        const el = cm.getWrapperElement();
        const isSage = el.closest('.sagecell') !== null && el.classList.contains('cm-s-default');
        
        // Add navigation to ALL CodeMirror instances
        addNavigationKeys(cm);
        
        // Add cell operation shortcuts to ALL CodeMirror instances
        addCellOperationShortcuts(cm);
        
        // Add autocomplete only to SageCell instances
        if (isSage) {
            addAutocompleteKeys(cm);
        }
    }

    function enhanceAllEditors() {
        getAllEditors().forEach(cm => enhanceEditor(cm));
    }

    function setupEnhancer() {
        // Load CodeMirror hint addon if needed
        if (!CodeMirror.hint) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.js';
            script.onload = function() {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/hint/show-hint.min.css';
                document.head.appendChild(cssLink);
                
                enhanceAllEditors();
            };
            document.head.appendChild(script);
        } else {
            enhanceAllEditors();
        }

        // Watch for new editors being added
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // If the node itself is a CodeMirror
                        if (node.classList && node.classList.contains('CodeMirror')) {
                            if (node.CodeMirror) enhanceEditor(node.CodeMirror);
                        }
                        // Or if it contains CodeMirror(s)
                        else if (node.querySelectorAll) {
                            node.querySelectorAll('.CodeMirror').forEach(el => {
                                if (el.CodeMirror) enhanceEditor(el.CodeMirror);
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize
    setupEnhancer();
}
