
export interface MathTopic {
    paper: number;
    title: string;
    tags: string;
    content: { topic: string; ex: string }[];
    icon?: string;
    iconComponent?: any;
}

export interface Question {
    q: string;
    a: string[];
    options?: string[];
}

export const TOPICS: MathTopic[] = [
    {
        paper: 1, title: 'Whole Numbers', tags: 'calculations prime factors hcf lcm ratio rate vat interest exchange',
        content: [
            { topic: 'Estimation, long division, rounding', ex: '456 ÷ 12 = 38' },
            { topic: 'Prime factorisation, HCF & LCM', ex: '24 = 2^3 × 3' },
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
            { topic: 'Fraction division', ex: '1/2 ÷ 1/4 = 2' },
            { topic: 'Percentage increase/decrease', ex: '50 + 10% = 55' },
            { topic: 'Reciprocals and mixed numbers', ex: 'Recip of 2/3 is 1.5' }
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

export const FIXED_QUESTIONS: Record<string, Question[]> = {
    paper1: [
        { q: "Simplify: 4x + 7x - 2x", a: ["9x", "9 x"] },
        { q: "Evaluation: If a=3, find 4a - 5", a: ["7"] },
        { q: "Scientific: 45000 in scientific notation.", a: ["4.5e4", "4.5x10^4", "4.5*10^4"] },
        { q: "Fraction: What is 1/2 + 1/4?", a: ["0.75", "3/4"] },
        { q: "Solve: 2x = 50", a: ["25"] },
        { q: "Integers: Calculate -8 + 12", a: ["4"] },
        { q: "Exponents: Simplify x² · x³", a: ["x^5", "x5"] },
        { q: "Factors: What is the HCF of 12 and 18?", a: ["6"] },
        { q: "Patterns: Next term in 2, 5, 8, ...", a: ["11"] },
        { q: "Ratio: Divide 20 in ratio 1:4. Smallest part?", a: ["4"] },
        { q: "Percent: 10% of 150", a: ["15"] },
        { q: "Substitution: y = 2x + 1. If x=0, y=?", a: ["1"] }
    ],
    paper2: [
        { q: "Area: Rectangle with L=12, W=4", a: ["48"] },
        { q: "Angles: Interior sum of a triangle (deg)?", a: ["180"] },
        { q: "Square: Perimeter of square side 7", a: ["28"] },
        { q: "Sides: How many sides in a pentagon?", a: ["5"] },
        { q: "Convert: 5000m to kilometers", a: ["5", "5km", "5.0"] },
        { q: "Triangles: Isosceles has 2 equal sides. T/F?", a: ["T", "True", "Yes"] },
        { q: "Circle: Radius if Diameter is 10?", a: ["5"] },
        { q: "Pythagoras: Hypotenuse of 3-4-? triangle", a: ["5"] },
        { q: "Angles: Supplement of 80°", a: ["100"] },
        { q: "Volume: Cube with side 2. Volume=?", a: ["8"] },
        { q: "Lines: Slopes of parallel lines are equal. T/F?", a: ["T", "True", "Yes"] },
        { q: "Transform: Reflect (2,3) over x-axis. New y?", a: ["-3"] }
    ]
};
