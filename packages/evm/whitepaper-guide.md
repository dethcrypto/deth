# Whitepaper Guide

https://ethereum.github.io/yellowpaper/paper.pdf

This glossary will make reading the whitepaper much easier

## Terms

### Machine State

- μ - machine state
- μ<sub>g</sub> - available gas
- μ<sub>pc</sub> - program counter
- μ<sub>m</sub> - memory content
- μ<sub>i</sub> - memory word count
- μ<sub>s</sub> - stack
- μ<sub>o</sub> - data returned from previous call

### System State

- σ - system state
- σ&#91;a&#93;<sub>n</sub> - nonce
- σ&#91;a&#93;<sub>b</sub> - balance
- σ&#91;a&#93;<sub>s</sub> - storage root
- σ&#91;a&#93;<sub>c</sub> - code hash

### Transaction

- T - transaction
- T<sub>n</sub> - nonce
- T<sub>p</sub> - gas price
- T<sub>g</sub> - gas limit
- T<sub>t</sub> - recipient (to)
- T<sub>v</sub> - value
- T<sub>w</sub>, T<sub>r</sub>, T<sub>s</sub> - signature (v, r, s)
- T<sub>i</sub> - init code
- T<sub>d</sub> - data

### Block header

- H - transaction
- H<sub>p</sub> - parent hash
- H<sub>o</sub> - uncle (ommers) root
- H<sub>c</sub> - coinbase (beneficiary)
- H<sub>r</sub> - state root
- H<sub>t</sub> - transactions root
- H<sub>e</sub> - receipts root
- H<sub>b</sub> - logs bloom
- H<sub>d</sub> - difficulty
- H<sub>i</sub> - number (0 for genesis)
- H<sub>l</sub> - gas limit
- H<sub>g</sub> - gas used
- H<sub>s</sub> - unix timestamp
- H<sub>x</sub> - extra data
- H<sub>m</sub> - mix hash (proof of work)
- H<sub>n</sub> - nonce (proof of work)

### Transaction receipt

- R - transaction receipt
- B<sub>R&#91;i&#93;</sub> - i-th transaction receipt
- R<sub>u</sub> - cumulative gas used
- R<sub>l</sub> - logs
- R<sub>b</sub> - bloom filter
- R<sub>z</sub> - status code

### Log entry

- O - log entry
- O<sub>a</sub> - address of the logger
- O<sub>t1</sub>, O<sub>t2</sub>, ... - topics
- O<sub>d</sub> - data

### Accrued substate

- A - accrued substate
- A<sub>s</sub> - self-destruct set
- A<sub>l</sub> - log series
- A<sub>t</sub> - touched accounts
- A<sub>r</sub> - refund balance

### Execution environment

- I - execution environment
- I<sub>a</sub> - address
- I<sub>o</sub> - origin
- I<sub>p</sub> - gas price
- I<sub>d</sub> - input data
- I<sub>s</sub> - sender (from)
- I<sub>v</sub> - value
- I<sub>b</sub> - code to be executed
- I<sub>H</sub> - block header of current block
- I<sub>e</sub> - call depth (initially 0)
- I<sub>w</sub> - state modification permission

### Other

- g - remaining computation gas
- o - resultant output
- Ξ - new state function
