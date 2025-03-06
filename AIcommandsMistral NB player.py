priming_ai_assistant = {
'Complete':'''
**Your name is AI and you are a coding assistant. You are helping the user complete the SageMath code they are trying to write.**

Here are the requirements for completing the SageMath code:

- Only complete the SageMath code according to INSTRUCTIONS below.
- Provide code that demonstrates the most elegant approaches typical for SageMath (e.g. using .subs())
- Do not write a code that overwrites previous variables.
- Do not import any library.
- Do not import any commands from libraries.
- Do not provide a code as a function, only if the user explicitly asks you to.
- Only put the completed code in a function, if the user explicitly asks you to.
- Provide code that is intelligent, correct, efficient, and readable.
- Do not give any summarizing comments before or after the SageMath code.
- If you are not sure about something, don't guess. 
- Keep your responses short and to the point.
- Never refer to yourself as "AI", you are a coding assistant.
- Never ask the user for a follow-up. Do not include pleasantries at the end of your response.
- Briefly summarise the new code you wrote and this summarization put
as a Python comment at the beginning of your code 
- Give only your code and Python comments, no other texts or notes, do not use Markdown for your output
- Curly braces in this prompt are represented by ASCII codes &#123, &#125
- Use standard symbols for curly braces instead ASCII codes &#123, &#125 in your response
''', 

'Format':'''
**Your name is AI and you are a coding assistant. You are helping the user to improve the SageMath code formatting in the LAST CELL.**

Here are the requirements for improving the formatting of the SageMath code:

- Never alter the SageMath code itself, only improve the formatting.
- Do not include import statements in your response, only the SageMath code itself.
- Improvements that you need to make where possible:
    - Do not add extra commands to existing commands
    - Add comments to explain what the SageMath code is doing.
    - Improve the spacing of the SageMath code to make it easier to read.
    - Add docstrings to functions and classes.
    - Add summarizing comments for algorithmic structures.
    - In docstrings explain the parameters of existing functions and classes.
    - Check existing docstrings and modify them if they are not relevant.
    - Check existing comments and modify them if they are not relevant.
- Only put the formatting code in a function if the original code was in a function, otherwise just improve the formatting of the SageMath code.
- If you are not sure about something, don't guess. 
- Keep your responses short and to the point.
- Never refer to yourself as "AI", you are a coding assistant.
- Never ask the user for a follow-up. Do not include pleasantries at the end of your response.
- Curly braces in this prompt are represented by ASCII codes &#123, &#125
- Use standard symbols for curly braces instead of ASCII codes &#123, &#125 in your response.
- DO NOT modify the commands in the SageMath code regarding the language.
- DO NOT add any other explanations about what you did.
- In your answer DO NOT repeat given requests.
''',

'Explain': '''

**Your name is AI and you are a coding assistant. You are helping the user understand the SageMath code in the FOCAL CELL by explaining it.**

Here are the requirements for your explanation:

- Explain the SageMath code in the FOCAL CELL as clearly as possible.
- If you are not sure about something, don't guess. 
- Keep your responses short and to the point.
- Never refer to yourself as "AI", you are a coding assistant.
- Never ask the user for a follow-up. Do not include pleasantries at the end of your response.
- Use markdown to format your response where possible.
- If reasonable, provide a line-by-line explanation of the SageMath code using markdown formatting and clearly labelled inline comments. 
- Curly braces in this prompt are represented by ASCII codes &#123, &#125
- Use standard symbols for curly braces instead of ASCII codes &#123, &#125 in your response
''',

'Sage': r'''
Ťahák ANALÝZA - Jupyter + Sage
Predmety ZMF, DGS - Jozef Hanč
Podla ref. William Stein, Sage Quick Reference: Calculus
http://wiki.sagemath.org/quickref

## Vstavané konštanty, funkcie, množiny

Konštanty: $\pi=\mathrm{pi} \quad e=\mathrm{e} \quad \infty=00=$ infinity $i=\mathrm{I}=\mathrm{i} \quad \log (2)=\log 2 \quad \phi=$ golden_ratio .. Približne: pi.n(digits=18) $=3.14159265358979324$
Vstavané funkcie: sin cos tan cot sec csc sinh
cosh tanh coth sech csch exp ln log...
Množiny (okruhy): $\mathbb{Z}=\mathrm{ZZ} \quad \mathbb{Q}=\mathrm{QQ} \quad \mathbb{R}=\mathrm{RR} \quad \mathbb{C}=\mathrm{CC}$ Komplexné čísla $z=a+b i: 2+3 * \mathrm{i}$; $1 / 2-\operatorname{sqrt}(2) * \mathrm{I}$ reálna a imaginárna čast́ $z$ : z.real(); z.imag()
modul a $\operatorname{argument} z: \quad \operatorname{abs}(z) ; \arg (z)$
komplexne združené $\bar{z}$ : $\quad$ z.conjugate()

## Definícia symbolických výrazov

Vytvorenie symbolických premenných $t, u, \theta$ :
$\mathrm{t}, \mathrm{u}$, theta $=\operatorname{var}($ 't, $\mathrm{u}, \mathrm{theta}$ ') alebo \%var $\mathrm{t}, \mathrm{u}$, theta
Použi vždy * pre násobenie, ^ alebo $* *$ pre umocňovanie: $2 x^{5}+\sqrt{2}=2 * x^{\wedge} 5+\operatorname{sqrt}(2)=2 * x * * 5+\operatorname{sqrt}(2)$
Štand. mat. vzhl’ad: všetky výstupy \%display latex jeden výstup show ( $2 *$ theta^5+sqrt (2)) $\longrightarrow 2 \theta^{5}+\sqrt{2}$

## Vlastné symbolické funkcie

Vlastná funkcia (možno ju integrovat', derivovat', atd’.):

$$
f(a, b, \text { theta })=a+b * \text { thet }^{\wedge} 2
$$

Formálna symbolická funkcia $f$ závisiaca na premennej $t$ : $f(t)=$ function('f')(t) alebo $f=$ function('f') (t)

## Vlastné pythonovské funkcie

Definícia (s nepovinným prednast. parametrom theta):
def $f(a, b$, theta $=1.5)$ :
value $=a+b *$ theta^2
return value
Ekvivalentná jednoriadková definícia:
$f=\operatorname{lambda} a, b$, theta=1.5: a $+\mathrm{b} *$ theta $^{\wedge} 2$

## Jednoduchý graf a body funkcie

2 D graf na $\langle a, b\rangle$ : plot ( $\mathrm{f}(\mathrm{x}),(\mathrm{x}, \mathrm{a}, \mathrm{b}))$
$\mathrm{g}=\operatorname{plot}(\mathrm{x} * \sin (\mathrm{x}),(\mathrm{x},-2,10))$; show $(\mathrm{g})$
Body v grafe g: points [zoznam bodov, farba, velkost' bodu] $z=(2,2),(4,-2),(1 / 2,1 / 2)$;
$\mathrm{b}=$ points $(\mathrm{z}$, color='red', pointsize $=50)$; show $(\mathrm{g}+\mathrm{b})$
3 D graf na $\langle a, b\rangle \times\langle c, d\rangle$ : $\operatorname{plot}(\mathrm{f}(\mathrm{x}, \mathrm{y}),(\mathrm{x}, \mathrm{a}, \mathrm{b}),(\mathrm{y}, \mathrm{c}, \mathrm{d}))$ $p=p l o t 3 d(x * \sin (y),(x,-5,5),(y,-5,5)) ; \operatorname{show}(p)$

## Zjednodušovanie a substitúcia

Symbolický výraz $f$ alebo funkciu $f(x, y, \ldots)$ možno zjednodušit́: f.simplify(), f.full_simplify(), f.canonicalize_radical()
roznásobit́: $\mathrm{f} . \operatorname{expand}()$, združit členy s $x$ : f.collect (x) exp. log. trig. funkcie: f.simplify_trig()/_log()/_exp() f.expand_trig()/_log(), f.reduce_trig() substitúcia (za výraz v1 dosadíme v2): f.subs(v1==v2)

## Rozklad na súčin

f.factor(): (x^3-y^3).factor() alebo 360.factor() Zoznam dvojíc (činitel', jeho exponent):
( $x^{\wedge} 3-y^{\wedge} 3$ ).factor_list() alebo list(360.factor())
Relácie $f=g: \mathrm{f}==\mathrm{g}, f \neq g: \mathrm{f} \mathrm{l}=\mathrm{g}, f \leqq g: \mathrm{f}<=\mathrm{g}$, $f \geqq g: \mathrm{f}>=\mathrm{g}, f<g: \mathrm{f}<\mathrm{g}, f>g: \mathrm{f}>\mathrm{g}$

## Rovnice, nerovnice, sústavy

Množina (zoznam) riešení $f(x)=g(x)$ alebo $f(x) \geqq g(x)$ : solve $(\exp (2 * x)==1 / 7, x) ;$ solve $\left(x^{\wedge} 2-6>=8, x\right)$
Výpis jednotlivých riešení rovnice - použitie slovnika
$\mathrm{s}=\operatorname{solve}\left(\ln \left(x^{\wedge} 2\right)==5 / 3, x\right.$, solution_dict=True)
$\mathrm{s}[0][\mathrm{x}], \mathrm{s}[1][\mathrm{x}]$ sú jej dve riešenia (Sage čísluje od 0)
Presné korene polynómu: ( $\left.x^{\wedge} 3+2 * x+1\right) . \operatorname{roots}(x)$
Reálne korene: $\quad\left(x^{\wedge} 3+2 * x+1\right)$.roots ( $x$, ring $=R R$ )
Komplexné korene: $\left(x^{\wedge} 3+2 * x+1\right) \cdot \operatorname{roots}(x, r i n g=C C)$
Zoznam riešení sústavy rovníc $r_{1}, r_{2}$ :

```
    r1 = (x^2+y^2==1); r2 = ((x-1)^2+y^2==1);
    solve([r1,r2],x,y)
```


## Fitovanie a optimalizácia

Fitovanie (MNŠ): dáta $=$ zoznam bodov, model $=$ funkcia data $=(0,1),(1,1 / 2),(2,0) ; \operatorname{model}(x)=a+b * x ;$ find_fit(data,model)
Riešenie rovnice $f(x)=0$ na $\langle a, b\rangle$ : $\mathrm{f} . \mathrm{find} \mathrm{\_root(a}, \mathrm{b)}$ $f(x)=x^{\wedge} 2-2 ; f . f i n d \_r o o t(1,2)$
Nájdenie maxima alebo minima $f(x)$ na $\langle a, b\rangle$ :
f.find_local_maximum(a, b)
f.find_local_minimum(a, b)

## Limity

$\lim _{x \rightarrow a} f(x)=\operatorname{limit}(\mathrm{f}(\mathrm{x}), \mathrm{x}=\mathrm{a})$
$\lim _{x \rightarrow a^{+}} f(x)=\operatorname{limit}(\mathrm{f}(\mathrm{x}), \mathrm{x}=\mathrm{a}, \operatorname{dir}=$ 'plus')
$\lim _{x \rightarrow a^{-}} f(x)=\operatorname{limit}(\mathrm{f}(\mathrm{x}), \mathrm{x}=\mathrm{a}, \operatorname{dir}=$ 'minus')
$\operatorname{limit}\left(1 / x, x=0, \operatorname{dir}=' m i n u s^{\prime}\right) ; \operatorname{limit}\left(1 / x^{\wedge} 2, x=-\infty 0\right)$

## Derivácie

$\frac{d}{d x} f(x)=\operatorname{diff}(\mathrm{f}(\mathrm{x}), \mathrm{x})=\mathrm{f} . \operatorname{diff}(\mathrm{x})$
$\frac{\partial}{\partial x} f(x, y)=\operatorname{diff}(\mathrm{f}(\mathrm{x}, \mathrm{y}), \mathrm{x})$
diff $=$ diferencovat $=$ derivovat
$\operatorname{diff}\left(x * y+\sin \left(x^{\wedge} 2\right)+e^{\wedge}(-x), x\right)$

## Integrály

Neurčitý: $\int f(x) d x=$ integral $(\mathrm{f}, \mathrm{x})=\mathrm{f}$.integrate $(\mathrm{x})$ integral (x*cos(x^2), x)
Rozklad na parciálne zlomky:
( $\left.\mathrm{x}^{\wedge} 2 /(\mathrm{x}+1)^{\wedge} 3\right)$.partial_fraction()
Určitý: $\int_{a}^{b} f(x) d x=$ integral ( $\mathrm{f}, \mathrm{x}, \mathrm{a}, \mathrm{b}$ )
integral ( $\left.\mathrm{x} * \cos \left(\mathrm{x}^{\wedge} 2\right), \mathrm{x}, 0,1\right)$
Numerický výpočet integrálu - [0] výsledok, [1] chyba:
$\int_{a}^{b} f(x) d x \approx$ numerical_integral ( $\left.\mathrm{f}(\mathrm{x}), \mathrm{a}, \mathrm{b}\right)[0]$
numerical_integral ( $\mathrm{x} * \cos \left(\mathrm{x}^{\wedge} 2\right.$ ) , 0,1 ) [0]
Použi predpoklad, ak to Sage žiada: assume ( $n>0$ ) alebo iný algoritmus: integral ( $1 / \mathrm{x}, 0, \mathrm{v}$, algorithm $=$ 'sympy')

## Obyčajné diferenciálne rovnice

Diferenciálna rovnica ( DR ) 1. rádu: $y^{\prime}=f(x, y)$ $y(x)=$ function ('y') (x)
DR1 $=\operatorname{diff}(\mathrm{y}, \mathrm{x})==\mathrm{f}(\mathrm{x}, \mathrm{y})$
Lineárna DR 2. rádu: $y^{\prime \prime}+p(x) y^{\prime}+q(x) y=f(x)$ DR2 $=\operatorname{diff}(\mathrm{y}, \mathrm{x}, 2)+\mathrm{p}(\mathrm{x}) * \operatorname{diff}(\mathrm{y}, \mathrm{x})+\mathrm{q}(\mathrm{x}) * \mathrm{y}==\mathrm{f}(\mathrm{x})$
Riešenie všeobecné (ivar $=$ nezávislá premenná): desolve(DR1, y, ivar=x) ; desolve(DR2, y, ivar=x)
Riešenie s počiatoč. podmienkou $\left(x_{0}, y_{0}\right)$, resp. $\left(x_{0}, y_{0}, y_{0}^{\prime}\right)$ desolve(DR1, y, ivar=x, ics=[x0,y0]) desolve(DR2, y, ivar=x, ics=[x0,y0,y0'])

## Vektorová analýza

Skalárna funkcia (pole): $f$ (vars), kde vars $=x, y, z, \ldots$ $\mathrm{g}(\mathrm{x}, \mathrm{y})=\mathrm{x}^{\wedge} 2 * \mathrm{y}+\mathrm{y}^{\wedge} 2+\mathrm{y}$
$f(x, y, z)=\sin \left(x^{\wedge} 2+y^{\wedge} 2+z^{\wedge} 2\right)$
Gradient a Hessián skalárnej funkcie (pol’a): f.gradient() f.hessian() gradg $=$ g.gradient () ; gradg $(1,1)$
Vektorová funkcia (pole): (f1(vars), ..., fn(vars)) $f(x, y, z)=(\sin (y), \cos (x), \tan (z))$
Jakobián vektorovej funkcie: jacobian(f,[vars]) Jf = jacobian(f, [x,y,z]); Jf(2,1,-3)
Divergencia a rotácia vektor. pola: f.div(), f.curl() $\operatorname{divf}=\mathrm{f} . \operatorname{div}() ; \operatorname{divf}(1,1, z)$
rotf $=$ f.curl(); rotf(x,y,z)

## Ťahák ALGEBRA - Jupyter + Sage <br> Predmety ZMF, DGS - Jozef Hanč

Podl'a ref. Robert Beezer, Sage Quick reference: Linear Algebra http://wiki.sagemath.org/quickref

## Vektory - zadávanie

Pozor! prvý prvok vektora má poradové číslo 0 $u=\operatorname{vector}(Q Q,[1,3 / 2,-1]) 3$-zložkový vektor zlomkov $\mathrm{v}=\operatorname{vector}(\mathrm{ZZ},[1,8,-2]) 3$-zložkový vektor celých čísel $\mathrm{z}=\operatorname{vector}(\mathrm{QQ},\{2: 4,95: 4,210: 0\})$ pozri riedke vektory 211 zložiek, nenulová 3 . a 96 . zložka s hodnotou 4

## Vektory - operácie

v.column() stlpcový vektor z vektora $\mathbf{v}$
$2 * u-3 * v$ lineárna kombinácia vektorov $\mathbf{u}, \mathbf{v}$
u.dot_product (v) alebo u*v skalárny súčin $\mathbf{u} \cdot \mathbf{v}$
u.cross_product(v) vektorový súčin $\mathbf{u} \times \mathbf{v}$
u.pairwise_product(v) súčin po zodp. zložkách
u.norm() == u.norm(2) euklidovská norma vektora u.norm(1) súčet abs. hodnôt zložiek vektora u.norm(oo) zložka vektora s max. abs. hodnotou

## Matice - zadávanie

Pozor! číslovanie riadkov a stípcov sa začína od 0
$\mathrm{A}=\operatorname{matrix}(\mathrm{ZZ},[[1,2],[3,4],[5,6]])$
$3 \times 2$ matica celých čísel
$B=\operatorname{matrix}(Q Q, 2,[1,2,3,4,5,6])$
vytvorí 2 riadky zo zoznamu; $2 \times 3$ matica rac. čísel
C = matrix (CDF, 2, 2, [[5*I, 4*I], [I, 6]])
$2 \times 2$ matica komplexných čísel; 53-bitová presnost?
$\mathrm{Z}=\operatorname{matrix}(\mathrm{QQ}, 2,2,0) 2 \times 2$ matica núl
$\mathrm{D}=\operatorname{matrix}(\mathrm{QQ}, 2,2,8)$ prvky hl. diag. sú 8 , ostat. 0
H = diagonal_matrix $([1,2,3]) \mathrm{s}$ hl. diagonálou $1,2,3$
$\mathrm{T}=$ matrix.toeplitz $([1,2,3],[4,5])$
prvky hl. diag. sú 1 , na diagonálach pod 2,3 a nad 4,5 $\mathrm{E}=$ block_matrix $([\mathrm{P}, 0],[1, \mathrm{R}]])$, bloková matica
II = identity_matrix(5) $5 \times 5$ jednotková matica
$I \equiv \sqrt{-1}$, preto maticiam nedávajte meno $I$
J = jordan_block( $-2,3$ ) $3 \times 3$ matica
$\mathrm{s}-2$ na hl. diagonále, s 1 na diagonále nad ňou $\operatorname{var}\left(' \mathrm{x} y \mathrm{z}\right.$ ') ; K $=\operatorname{matrix}\left(\mathrm{SR}, \quad\left[[\mathrm{x}, \mathrm{y}+\mathrm{z}],\left[0, \mathrm{x}^{\wedge} 2 * \mathrm{z}\right]\right]\right)$
$2 \times 2$ symbolická matica
$\mathrm{L}=\operatorname{matrix}(\mathrm{ZZ}, 20,80,\{(5,9): 30,(15,77):-6\})$
$20 \times 80$, dva nenulové prvky s danými pozíciami
Maticové priestory - zadávanie a vlastnosti
$\mathrm{M}=$ MatrixSpace (QQ, 3, 4) priestor matíc $3 \times 4$
$A=M([1,2,3,4,5,6,7,8,9,10,11,12])$
zmení zoznam na prvok M, maticu $3 \times 4$ nad QQ M.basis(), M.dimension() báza a dimenzia priestoru M M.zero_matrix() nulová matica z priestoru M

## Násobenie matíc

$\mathrm{u}=\operatorname{vector}(\mathrm{QQ}, \quad[1,2,3]), \mathrm{v}=\operatorname{vector}(\mathrm{QQ},[1,2])$
$\mathrm{A}=\operatorname{matrix}(\mathrm{QQ},[[1,2,3],[4,5,6]])$
$B=\operatorname{matrix}(Q Q,[[1,2],[3,4]])$
$u * A, \quad A * v, \quad B * A, \quad B^{\wedge} 6, \quad B^{\wedge}(-3)$ možné súčiny A.elementwise_product (B) súčin po zodp. zložkách B.iterates ( $\mathrm{v}, 6$ ) postupnost $v B^{0}, v B^{1}, \ldots, v B^{5}$ rows $=$ False dáva násobenie matíc zprava vektorom v $\mathrm{f}(\mathrm{x})=\mathrm{x} \wedge 2+5 * \mathrm{x}+3$, tak $\mathrm{f}(\mathrm{B})$ je hodnota funkcie v $B$
B. $\exp ()=\exp (B) e$ na maticový exponent, t.j. $\sum_{k=0}^{\infty} \frac{1}{k!} B^{k}$

## Ďalšie operácie s maticami

$5 * \mathrm{~A}+2 * \mathrm{~B}$ lineárna kombinácia
A.inverse(), $A^{\wedge}(-1)$ inverzná matica; pre neinvertibilnú (singulárnu) maticu vracia chybu ZeroDivisionError A.transpose() transponovaná matica
A.conjugate() matica komplexne združených zložiek
A.conjugate_transpose() transp. A.conjugate()
A.antitranspose() transponovaná s opačným poradím
A.adjoint() adjungovaná matica $=$ matica kofaktorov
A.restrict(V) reštrikcia na invariantný podpriestor $V$

## Riadkové a stípcové operácie $v$ maticiach

Dané riadkové (stĺpcové) operácie menia danú maticu.
Pozor! prvý riadok má poradové číslo 0
A.rescale_row(i,a) a*(riadok i)
A.add_multiple_of_row (i,j,a) a*(riadok j)+riadok i A.swap_rows (i,j) výmena riadkov i a j

Každá operácia má zodp. stípcovú obdobu, row $\rightarrow$ col
Ak nechceš zmeniť pôv. maticu, použi uloženie do pamäte B = A.with_rescaled_row(i,a)

## Gaussova eliminácia - horná trojuholníková forma

A.rref() horná trojuholníková (pod diagonálou sú 0) A.echelon_form() horná trojuholníková s 1 na diagonále A.echelonize() zmení A na hor. troj. s 1 na diagonále Pozn. rref() zmení automaticky na maticu rac. čísel $\mathrm{A}=\operatorname{matrix}(\mathrm{ZZ},[[4,2,1],[6,3,2]])$;

$$
\begin{gathered}
\mathrm{A} ; \\
\left(\begin{array}{ccc}
4 & 2 & 1 \\
6 & 3 & 2
\end{array}\right) \quad\left(\begin{array}{ccc}
\text { A.rref (); } & \text { A.echelon_form () } \\
0 & 1 & 0 \\
0 & 0 & 1
\end{array}\right) \quad\left(\begin{array}{ccc}
1 & \frac{1}{2} & 0 \\
0 & 0 & 1
\end{array}\right)
\end{gathered}
$$

A.pivots() indexy nezávislých stĺpcov (pivotov) A.pivot_rows() to isté pre riadky

## Časti matíc a submatice

Pozor! číslovanie riadkov a stĺpcov sa začína od 0
A.nrows(), A.ncols() počet riadkov a stípcov A

A [i,j] prvok matice v riadku i a stlpci j
A [i] riadok i ako pythonovská $n$-tica
A.row(i) vráti riadok i ako Sage vektor
A.column ( $j$ ) vráti stípec $j$ ako Sage vektor
A.list() zmení na zoznam podl’a riadkov (aj pre vektor)
A.matrix_from_columns ([8, 2, 8])
nová matica zo stĺpcov v zozname, môžu sa opakovat' A.matrix_from_rows ([2, 5, 1])
nová matica z riadkov v zozname, nemusia byṫ v poradí A.matrix_from_rows_and_columns $([2,4,2],[3,1])$
sučasne z daných riadkov a stĺpcov
A.rows () všetky riadky ako zoznam $n$-tíc
A.columns() všetky stípce ako zoznam $m$-tíc
A.submatrix(i,j,nr,nc)
začne na prvku ( $i, j$ ), použije $n r$ riadkov, nc stípcov A [2:4, 1:7] matica z riadkov 2 až 4 a stĺpcov 1 až 7 A [0:8:2,3::-1] pythonovský výber riadkov a stĺpcov

## Spájanie matíc

A.augment (B) A rozšíri zprava o $B$; $B$ môže byt vektor A.stack(B) A rozšíri zdola o B; B môže byt vektor A.block_sum (B) vráti maticu s A a B na diagonále A.tensor_product(B) tenzorový súčin A a B

## Skalárne funkcie matíc

A.rank() hodnost $=$ počet nezávislých stĺpcov (riadkov) A.right_nullity() počet závislých stĺpcov
A.left_nullity() == A.nullity() počet záv. riadkov A.determinant() == A.det() determinant matice A.permanent(), A.trace() stopa matice A.norm() == A.norm(2) $l_{2}$ (spektrálna) norma A.norm(1) najväčšia stípcová suma abs. hodnôt A.norm(oo) najväčšia riadková suma abs. hodnôt A.norm('frob') Frobéniova (Euklidovská) norma

## Matice - vlastnosti

.is_zero(); .is_symmetric(); .is_hermitian(); .is_square(); .is_orthogonal(); .is_unitary(); .is_scalar(); .is_singular(); .is_invertible(); .is_one(); .is_nilpotent(); .is_diagonalizable()

## Vlastné čísla a vlastné vektory matíc

Pozn. eigenvalue(vector) = vlastná hodnota(vektor)
A. charpoly ('t'), bez premennej automaticky berie x
A.characteristic_polynomial() == A.charpoly()
A.fcp('t') charakteristický polynóm rozložený na súčin
A.minpoly() minimálny polynóm
A.minimal_polynomial() == A.minpoly()
A.eigenvalues() netriedený zoznam aj s násobnostou
A.eigenvectors_right() vlastné vektory zprava;
vracia pre každú vlastnú hodnotu trojicu:
e: vlastnú hodnotu;
V: zoznam bázových vlast. vektorov; n: násobnost
A.eigenmatrix_right() vlastné vektory zprava;
vracia dvojicu: D: diagonálna matica vlast. hodnôt P: vlastné vektory ako stĺpce
vracia nulové stĺpce pri nediagonalizovatelnosti
Pozn. každému príkazu _right zodpovedá príkaz _left

## Rozklady matíc

Pozn. dostupnost závisí na zvolenom okruhu matíc; použi RDF,CDF pre numerické výpočty; QQ,AA exaktné unitárnost $=$ ortogonalita pre mat. s prvkami $\mathrm{v} \mathbb{R}$
A.jordan_form(transformation=True)
vráti dvojicu matíc: pre $\mathrm{A}=\mathrm{P}^{\wedge}(-1) * \mathrm{~J} * \mathrm{P}$
J: matica Jordan. blokov pre vlastné hodnoty
P: nesingulárna matica
A.smith_form() trojicu: pre D == U*A*V

D: elementárne delitele na diagonále
$\mathrm{U}, \mathrm{V}$ : s jednotkovým determinantom
A. LU() trojica: pre $P * A==L * U$

P : permutačná matica
L: dolná trojuholníková, U: horná trojuholníková
A. $\mathrm{QR}($ ) dvojica: pre $A==\mathrm{Q} * \mathrm{R}$

Q: unitárna matica, R: horná trojuholníková
A.SVD() trojica: pre A $==\mathrm{U} * \mathrm{~S} *$ (V-conj-transpose)

U : unitárna matica
S: diagonálna s rozmermi A
V: unitárna matica
A. $\operatorname{schur}()$ dvojica: pre $A==Q * T *(Q-c o n j-t r a n s p o s e)$

Q: unitárna matica
T: horná-trojuh. matica; môže byṫ tvar $2 \times 2$ diag. bloky A.rational_form() Frobéniova forma
A.symplectic_form() symplektická forma
A.hessenberg_form() Hessenbergova forma
A.cholesky() Choleského rozklad

## Sústavy rovníc - riešenie cez matice

A.solve_right (B), odbobne príkaz s _left
je riešenie sústavy $A * X=B, X$ vektor či matica neznámych
$A=\operatorname{matrix}(Q Q,[[1,2],[3,4]])$
$b=\operatorname{vector}(Q Q,[3,4]) ; A \backslash b$ dáva riešenie $(-2,5 / 2)$

## Vektorové priestory - zadávanie

VectorSpace (QQ, 4) 4-rozmerný nad polom $\mathbb{Q}$ VectorSpace (RR, 4) 4-rozmerný nad pol'om $\mathbb{R}$
VectorSpace (RealField(200), 4)
pole R má 200-bitovú presnost (štandardne 53)
CC~4 vektorový priestor 4-rozmerný nad polom $\mathbb{C}$
$\mathrm{Y}=$ VectorSpace (GF(7), 4) konečný priestor, ktorý má $7^{4}=2401$ prvkov, uložených v Y.list()

## Vektorové priestory - vlastnosti

## V.dimension() dimenzia priestoru V

V.basis() báza priestoru V
V.echelonized_basis() báza po Gaussovej eliminácii
V.has_user_basis() má V nekanonickú bázu?
V.is_subspace(W) pravda =True, ak W je podpriestor V
V.is_full() rovná sa hodnost' stupňu modulu?
$\mathrm{Y}=\mathrm{GF}(7)^{\wedge} 4, \quad \mathrm{~T}=\mathrm{Y}$. subspaces (2)
$T$ je generátor 2D podpriestorov $\mathrm{v} Y$
[U for $U$ in $T$ ] je zoznam 2850 2D podpiestorov $v Y$, použi T.next() na prechádzanie cez podpriestory

## Vektorové podpriestory - zadávanie

span([v1,v2,v3], QQ) obálka vektorov nad zvol.polom
Pre maticu A, dostávame:
vektorové priestory, ak okruhom je pole
moduly, ak okruhom je len okruh
A.left_kernel() == A.kernel() jadro; obd. right_
A.row_space()==A.row_module() riadkový priestor
A.column_space()==A.column_module() stlpc. priestor
A.eigenspaces_right() vektory zprava; obd. _left

Dvojice: vlastné hodnoty a vektory zprava
A.eigenspaces_right (format='galois')

1 vlast. priestor na ireducibilný činitel' char. polynómu
Ak V a W sú podpiestory, tak
V.quotient(W) faktorový priestor
V.intersection(W) prienik V a W
V.direct_sum(W) direktný súčet V a W
V.subspace([v1,v2,v3]) podpriestor V z vektorov

## Plné a riedke vektory, matice

Pozn. algoritmy závisia na zvol. reprezetácii;
vektory a matice majú dve reprezentácie:
plná (dense): používame zoznamy
riedka (sparse): používame slovníky
.is_dense(), .is_sparse() zistí reprezentáciu
A.sparse_matrix() vracia riedku verziu A
A.dense_rows() vracia plné riadkové vektory z A

Niektoré príkazy obsahujú sparse ako boolovský výraz.

## Okruhy a ich vlastnosti

Pozn. Algoritmy zvyčajne závisia od zvol. okruhu <object>.base_ring(R) pre vektory, matice, ... zisti zvolený okruh
<object>.change_ring(R) pre vektory, matice, ... zmeň okruh (pole) na okruh (pole) R
R.is_ring(), R.is_field(), R.is_exact()

Hlavné vstavané okruhy a polia v systéme Sage ZZ okruh celých čísel
QQ pole racionálnych čísel
AA, QQbar polia algebraických čísel (nekon. presnost') RDF pole reálnych čísel, 53 bitov (pre rýchle výpočty) CDF pole kompl. čísel, 53 bitov (pre rýchle výpočty) RR pole reálnych čísel, 53 bitov
RealField(400) 400-bitová presnost
CC, ComplexField(400) 400-bitová presnost RIF pole reálnych intervalov
IntegerModRing(4) okruh zvyškových tried mod 4 GF (2) pole zvyškových tried mod 2
GF (p)==FiniteField (p) zvyš. triedy mod p(prvočíslo) Integers (6) okruh zvyš. tried mod 6
CyclotomicField(7) rac. čísla so 7. jedn. koreňom QuadraticField( $-5, \quad$ ' $x$ ') rac. čísla $s x=\sqrt{-5}$
SR okruh symbolických premenných a výrazov

## Poznámka k vektor. priestorom a modulom

Modul "je" vektor. priestor nad okruhom (nie nutne pol'om). Mnoho príkazov z vekt. priestorov možno aplikovat na moduly. Niektoré "vektory" sú v skutočnosti prvky modulov.

## Kde hladat' pomoc - Jupyter

"kláves Tab" dokončenie príkazu, vlastností, parametrov "stlačenie Shift+Tab" zobrazenie vlastností a popisu objektu <command>?+Shift+Enter = popis príkazu a pomoc s príkladmi <command>??+Shift+Enter $=$ pythonovský kód príkazu
'''
}

# Load Mistral
from mistralai import Mistral
import re
import time

from IPython.display import IFrame, display, HTML, Markdown, display_html
md = lambda text: display(Markdown(text))

# Define the dictionary for model names
model_dict = {
    "small": "mistral-small-latest",
    "medium": "mistral-medium-latest",
    "large": "mistral-large-latest",
    "codestral": "codestral-latest"
}


def replace_curly_braces(input_string):
    output_string = input_string.replace('{', '&#123;').replace('}', '&#125;')
    return output_string

def sanitize_long_data_raw_by_lines(text, line_threshold=20, head_lines=10, tail_lines=5):
    """
    Shortens triple-quoted strings that start with 'data_raw =' based on line count.

    Args:
        text (str): Input text to sanitize
        line_threshold (int): Number of lines above which string is considered too long
        head_lines (int): Number of lines to keep at the start
        tail_lines (int): Number of lines to keep at the end

    Returns:
        str: Text with long 'data_raw =' strings shortened
    """
    pattern = r'^(data_raw\s*=\s*r""")(.*?)("""\s*)$'
    
    def replacer(match):
        prefix = match.group(1)
        content = match.group(2)
        suffix = match.group(3)
        lines = content.splitlines()
        if len(lines) > line_threshold:
            new_content = "\n".join(
                lines[:head_lines] + ["\n.\n.\n.\n"] + lines[-tail_lines:]
            )
            return prefix + new_content + suffix
        else:
            return match.group(0)
    
    sanitized = re.sub(pattern, replacer, text, flags=re.DOTALL|re.MULTILINE)
    return sanitized

def sanitize_Ins(text):
    """
    Replaces content between "# -START OF AI CELL-" and "# -END OF AI CELL-" markers with "#".

    Args:
        text (str): Input string with AI cell code
    Returns:
        str: Text with AI cell replaced by "#"
    """
    pattern = r'# -START OF AI CELL-.*?# -END OF AI CELL-'
    text = sanitize_long_data_raw_by_lines(text)
    sanitized_ai = re.sub(pattern, '#', text, flags=re.DOTALL)
    return sanitized_ai

def AI_generate(message, model = None, api_key = ''):
    """
    Analyzes the given message using the specified model.

    Args:
        message (str): The message to analyze.
        model (str): The model to use for analysis (default is 'mistral-small-latest').

    Returns:
        str: The result of the analysis.
    """

    s = Mistral(api_key=api_key)  # Initialize the Mistral API client
    res = s.chat.complete(model=model, messages=[{"content": message, "role": "user"}])  # Get response from model

    if res is not None:
        return res.choices[0].message.content  # Extract and return the answer from the response
    return "Error: No response received."

def add_language(message, language):
    if language.lower() not in ['eng', 'english']:
        message += '- Provide your answer (all your comments and helps) in the following desired natural language (make a translation into it): **' + language + '**' +'''
        - DO NOT modify the commands in the SageMath code regarding the desired language.
        - PROVIDE comments in the SageMath code in the desired natural language\n''' 
    return message

def add_sage_references(message):
    message += '*Here are some helpfull REFERENCES on using SageMath*\n' + priming_ai_assistant['Sage'] + '\n'
    return message

def AI_complete(language=None, model=None, print_prompt=False, NBplayer_code=None, api_key = ''):
    NBplayer_code_s = sanitize_Ins(NBplayer_code)
    previous_code ='''
    **Here is the background information about the SageMath code:**
    *PREVIOUS CODE:*
    '''+'In['.join(NBplayer_code_s.split('In[')[:-1])+'\n'
    instructions  = '''
    **Here are INSTRUCTIONS for completing code:**
    ''' + '\n'+ NBplayer_code_s.split('In[FOCUS]')[-1]
    message = add_language(priming_ai_assistant['Complete'], language)
    message = add_sage_references(message)
    prompt = message + previous_code + instructions
    # AI processing
    AIresult = AI_generate(prompt, model=model, api_key=api_key)
    AIresult = AIresult.replace('```python','')
    AIresult = AIresult.replace('```','')
    return AIresult
    
def AI_format(language=None, model=None, print_prompt=False, NBplayer_code=None, api_key=''):
    NBplayer_code_s = sanitize_Ins(NBplayer_code)
    message = add_language(priming_ai_assistant['Format'], language)
    message = add_sage_references(message)
    last_code = NBplayer_code_s.split('In[')[-2][3:]
    query = NBplayer_code_s.split('In[FOCUS]')[-1]
    prompt = message + '''*CODE REQUIRING FORMATTING:*
    '''+ last_code + '''
    *ADITIONAL REQUSTS:*''' + query
    # AI processing
    AIresult = AI_generate(prompt, model=model, api_key=api_key)
    AIresult = AIresult.replace('```python','')
    AIresult = AIresult.replace('```','')
    
    return AIresult

    
def AI_explain(replace=True, language=None, previous_code=False, model=None, print_prompt=False, NBplayer_code=None, api_key=''):
    NBplayer_code_s = sanitize_Ins(NBplayer_code)
    message = add_language(priming_ai_assistant['Explain'], language)
    message = add_sage_references(message)
    prev_code_str = 'In['.join(NBplayer_code_s.split('In[')[:-2])
    focal_code = 'In[' + NBplayer_code_s.split('In[')[-2]
    query = NBplayer_code_s.split('In[FOCUS]')[-1]
    if previous_code:
        prompt = message + '''*PREVIOUS CODE:*
        ''' + prev_code_str + '''*FOCAL CODE:*
        ''' + focal_code + '''*ADITIONAL REQUSTS:*
        ''' + query
    else:
        prompt = message + '''*FOCAL CODE:*
        ''' + focal_code + '''*ADITIONAL REQUSTS:*
        ''' + query
    
    # AI processing
    
    AIresult = AI_generate(prompt, model=model, api_key=api_key)
    return "\n{}\n".format(AIresult)