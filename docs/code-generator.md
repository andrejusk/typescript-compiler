# Code Generator

The code generator takes a syntax tree and converts it into the target language. This
produces the end result of the compiler, which can be executed.

The implementation of the code generator involves recursively traversing the syntax
tree and generating code in pre-defined base cases. These range from the C file import
headers to variable declarations and arithmetic operations.

Raw code generated from previous examples can be seen in Figure 17 and Figure 18.

```C
    #include <stdio.h>
    int main() {
    printf("%s", "Hello, world!");
    return 0;
    }
```
*Figure 17. Code Generated from Figure 12 (A1.1. hello-world.ts)*

```C
 #include <stdio.h>
 int main() {
 int a = 1;
 int b = 2;
 int c;
 c = (a + b);
 printf("%d", c);
 return 0;
 }
```
*Figure 18. Code Generated from Figure 13 (A1.2. number-addition.ts)*