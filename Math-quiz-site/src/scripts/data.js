/* Data Structure */
const TOPICS = [
    {
        paper: 1, title: 'Whole Numbers', tags: 'calculations prime factors hcf lcm ratio rate vat interest exchange',
        content: [
            { topic: 'Estimation, long division, rounding', ex: '456 ÷ 12 = 38' },
            { topic: 'Prime factorisation, HCF & LCM', ex: '24 = 2³ × 3' },
            { topic: 'Rate & ratio sharing', ex: '100 in 2:3 → 40:60' },
            { topic: 'VAT, hire purchase and exchange', ex: '100 + 15% = 115' }
        ]
    },
    {
        paper: 1, title: 'Integers', tags: 'integers ordering comparing roots squares cubes inversions',
        content: [
            { topic: 'Ordering and comparing integers', ex: '-5 < -2' },
            { topic: 'Arithmetic operations', ex: '-8 + 10 = 2' },
            { topic: 'Squares, cubes, roots', ex: '√64 = 8' },
            { topic: 'Inverse properties', ex: '-x = 5 → x = -5' }
        ]
    },
    {
        paper: 1, title: 'Common Fractions', tags: 'fractions percentages reciprocals increase decrease',
        content: [
            { topic: 'Fraction division', ex: '½ ÷ ¼ = 2' },
            { topic: 'Percentage increase/decrease', ex: '50 + 10% = 55' },
            { topic: 'Reciprocals and mixed numbers', ex: 'Recip of ⅔ is 1.5' }
        ]
    },
    {
        paper: 1, title: 'Decimal Fractions', tags: 'decimals multiplication division rounding calculator',
        content: [
            { topic: 'Multiplying & dividing decimals', ex: '0.5 × 0.2 = 0.1' },
            { topic: 'Rounding and estimation', ex: '3.14159 ≈ 3.14' },
            { topic: 'Calculator context problems', ex: 'Area of ◯ = πr²' }
        ]
    },
    {
        paper: 1, title: 'Exponents', tags: 'scientific notation laws powers negative zero',
        content: [
            { topic: 'Exponential & scientific notation', ex: '5000 = 5 × 10³' },
            { topic: 'Exponent laws', ex: 'a² × a³ = a⁵' },
            { topic: 'Problem solving with powers', ex: '2³ = 8' }
        ]
    },
    {
        paper: 1, title: 'Numeric Patterns', tags: 'patterns numeric geometric extend rules',
        content: [
            { topic: 'Investigate numeric patterns', ex: '2, 4, 6... next 8' },
            { topic: 'Extension and rule generation', ex: 'Rule: Tₙ = 2n' }
        ]
    },
    {
        paper: 1, title: 'Functions', tags: 'flow diagrams tables formulae rules',
        content: [
            { topic: 'Tables and Formulae', ex: 'y = 2x + 1' },
            { topic: 'Input-output logic', ex: 'In 3 → Out 7' },
            { topic: 'Equivalent forms', ex: 'Table vs Equation' }
        ]
    },
    {
        paper: 1, title: 'Algebraic Expressions', tags: 'terms variables coefficients simplify substitute',
        content: [
            { topic: 'Terms and variables', ex: '3x: 3 is coeff' },
            { topic: 'Simplify and evaluate', ex: '2x + 3x = 5x' }
        ]
    },
    {
        paper: 1, title: 'Algebraic Equations', tags: 'equations substitution inverses word problems',
        content: [
            { topic: 'Additive/multi inverses', ex: 'x + 5 = 10 → x = 5' },
            { topic: 'Substitution tables', ex: 'Solve y if x=2' }
        ]
    },
    {
        paper: 1, title: 'Graphs', tags: 'linear nonlinear cartesian plane plot points discrete continuous',
        content: [
            { topic: 'Graph analysis', ex: 'Grad = rise/run' },
            { topic: 'Plotting on Cartesian plane', ex: 'Point (2, 3)' }
        ]
    },
    {
        paper: 2, title: 'Geometry of Lines', tags: 'angles perpendicular parallel transversal',
        content: [
            { topic: 'Angle relationships', ex: 'Vert. Opp. ∠s equal' },
            { topic: 'Parallel & transversals', ex: 'Alt/Corr ∠s' },
            { topic: 'Geometric problem solving', ex: 'Find unknown x' }
        ]
    },
    {
        paper: 2, title: '2D Geometries', tags: 'triangles equilateral isosceles right-angled similarity congruence',
        content: [
            { topic: 'Triangle properties', ex: 'Sum ∠s = 180°' },
            { topic: 'Solving for unknowns', ex: 'x+40+60=180' },
            { topic: 'Congruence & similarity', ex: 'SSS, SAS, AAS' }
        ]
    },
    {
        paper: 2, title: 'Theorem of Pythagoras', tags: 'right-angled theorem irrational surds',
        content: [
            { topic: 'Hypotenuse & side calc', ex: '3² + 4² = c²' },
            { topic: 'Irrational surds', ex: '√50 ≈ 7.07' },
            { topic: 'Right-angle determination', ex: 'a²+b²=c²' }
        ]
    },
    {
        paper: 2, title: 'Measurement', tags: 'circles polygons rectangles triangles convert units',
        content: [
            { topic: 'Perimeter & Area formulae', ex: 'Area ◯ = πr²' },
            { topic: 'Complex shape decomposition', ex: 'L-shape = 2 Rects' },
            { topic: 'SI unit conversions', ex: '1000m = 1km' }
        ]
    }
];

const generators = {
    pythag: () => {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 8) + 5;
        const c = Math.sqrt(a * a + b * b).toFixed(2);
        return { q: `In a right triangle, side short sides are ${a} and ${b}. Find the hypotenuse (round to 2 dp).`, a: [String(parseFloat(c)), c] };
    },
    equation: () => {
        const x = Math.floor(Math.random() * 8) + 2;
        const m = Math.floor(Math.random() * 6) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        const y = m * x + c;
        return { q: `Solve for x: ${m}x + ${c} = ${y}`, a: [String(x)] };
    },
    ratio: () => {
        const p1 = Math.floor(Math.random() * 3) + 2;
        const p2 = Math.floor(Math.random() * 3) + 4;
        const factor = Math.floor(Math.random() * 20) + 5;
        const total = (p1 + p2) * factor;
        return { q: `Divide $${total} in the ratio ${p1}:${p2}. How much is the larger share?`, a: [String(Math.max(p1, p2) * factor)] };
    },
    ordering: () => {
        // Generate 4 random integers
        const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20) - 10);
        const sorted = [...nums].sort((a, b) => a - b);
        return {
            type: 'dragdrop',
            q: "Arrange these numbers from smallest to largest.",
            items: nums,
            a: [sorted.join(',')] // Answers expected as comma-separated string
        };
    },
    matching: () => {
        const set = [
            { q: 'Area of Rectangle', a: 'l × b' },
            { q: 'Area of Circle', a: 'πr²' },
            { q: 'Perimeter Square', a: '4s' },
            { q: 'Volume Cube', a: 's³' },
            { q: 'Pythagoras', a: 'A² + B² = C²' },
            { q: 'Gradient (m)', a: 'Δy / Δx' }
        ];
        const subset = set.sort(() => 0.5 - Math.random()).slice(0, 3);
        const left = subset.map(i => i.q);
        const rightCorrect = subset.map(i => i.a);
        const rightShuffled = [...rightCorrect].sort(() => 0.5 - Math.random());

        return {
            type: 'matching',
            q: "Match the term to its formula (Align right items).",
            left: left,
            items: rightShuffled,
            a: [rightCorrect.join(',')]
        };
    },
    simplify: () => {
        const c1 = Math.floor(Math.random() * 5) + 2;
        const c2 = Math.floor(Math.random() * 5) + 2;
        const op = Math.random() > 0.5 ? '+' : '-';
        const ans = op === '+' ? c1 + c2 : c1 - c2;
        return { q: `Simplify: ${c1}x ${op} ${c2}x`, a: [`${ans}x`] };
    }
};

const fixedQuestions = {
    paper1: [
        { q: "Simplify: 4x + 7x - 2x", a: ["9x", "9 x"], ex: "Combine like terms: (4 + 7 - 2)x = 9x.", hint: "Group the x terms together." },
        { q: "Evaluation: If a=3, find 4a - 5", a: ["7"], ex: "Substitute a=3: 4(3) - 5 = 12 - 5 = 7.", hint: "Replace 'a' with 3." },
        { q: "Scientific: 45000 in scientific notation.", a: ["4.5e4", "4.5x10^4", "4.5*10^4"], ex: "Move decimal 4 places left: 4.5 × 10^4.", hint: "A x 10^n where 1 <= A < 10." },
        { q: "Fraction: What is 1/2 + 1/4?", a: ["0.75", "3/4"], ex: "Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4.", hint: "Find a common denominator (4)." },
        { q: "Solve: 2x = 50", a: ["25"], ex: "Divide both sides by 2: x = 50/2 = 25.", hint: "Isolate x by dividing." },
        { q: "Integers: Calculate -8 + 12", a: ["4"], ex: "Start at -8 and move 12 steps right on the number line to +4.", hint: "Think of it as 12 - 8." },
        { q: "Exponents: Simplify x² · x³", a: ["x^5", "x5"], ex: "Add exponents when multiplying same bases: 2 + 3 = 5.", hint: "Add the powers (2 + 3)." },
        { q: "Factors: What is the HCF of 12 and 18?", a: ["6"], ex: "Factors 12: 1,2,3,4,6,12. Factors 18: 1,2,3,6,9,18. Highest common is 6.", hint: "List factors of both, find biggest match." },
        { q: "Patterns: Next term in 2, 5, 8, ...", a: ["11"], ex: "The rule is +3. So 8 + 3 = 11.", hint: "What are we adding each time?" },
        { q: "Ratio: Divide 20 in ratio 1:4. Smallest part?", a: ["4"], ex: "Total parts = 1+4=5. One part = 20/5 = 4. Smallest is 1×4 = 4.", hint: "Sum the ratio parts first." },
        { q: "Percent: 10% of 150", a: ["15"], ex: "10/100 × 150 = 15.", hint: "Move the decimal one place left." },
        { q: "Substitution: y = 2x + 1. If x=0, y=?", a: ["1"], ex: "2(0) + 1 = 0 + 1 = 1.", hint: "Multiply 2 by 0 first." }
    ],
    paper2: [
        { q: "Area: Rectangle with L=12, W=4", a: ["48"], ex: "Area = L × W = 12 × 4 = 48.", hint: "Multiply Length by Width." },
        { q: "Angles: Interior sum of a triangle (deg)?", a: ["180"], ex: "The sum of interior angles in any triangle is always 180°.", hint: "It's half of a square (360)." },
        { q: "Square: Perimeter of square side 7", a: ["28"], ex: "Perimeter = 4 × side = 4 × 7 = 28.", hint: "Add all 4 sides." },
        { q: "Sides: How many sides in a pentagon?", a: ["5"], ex: "Penta means 5.", hint: "Think of the Pentagon building." },
        { q: "Convert: 5000m to kilometers", a: ["5", "5km", "5.0"], ex: "Divide meters by 1000: 5000 / 1000 = 5km.", hint: "Kilo means 1000." },
        { q: "Triangles: Isosceles has 2 equal sides. T/F?", a: ["T", "True", "Yes"], ex: "True. Isosceles has 2 equal sides/angles. Equilateral has 3.", hint: "Iso = equal legs." },
        { q: "Circle: Radius if Diameter is 10?", a: ["5"], ex: "Radius is half distance of diameter: 10 / 2 = 5.", hint: "Radius is half the diameter." },
        { q: "Pythagoras: Hypotenuse of 3-4-? triangle", a: ["5"], ex: "3-4-5 is a standard Pythagorean triple. √(3² + 4²) = √25 = 5.", hint: "Use a² + b² = c²." },
        { q: "Angles: Supplement of 80°", a: ["100"], ex: "Supplementary angles add to 180°. 180 - 80 = 100°.", hint: "Supplementary = 180 degrees." },
        { q: "Volume: Cube with side 2. Volume=?", a: ["8"], ex: "Volume = side³ = 2 × 2 × 2 = 8.", hint: "Multiply side × side × side." },
        { q: "Lines: Slopes of parallel lines are equal. T/F?", a: ["T", "True", "Yes"], ex: "True. Parallel lines never touch, so they have identical slopes.", hint: "Do they steepness differ?" },
        { q: "Transform: Reflect (2,3) over x-axis. New y?", a: ["-3"], ex: "Reflecting over x-axis flips the y-coordinate sign: (x, -y).", hint: "Change the sign of the second number." }
    ]
};
