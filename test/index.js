class A {
    plus(a, b) {
        window.enoDebug = () => { };
        enoDebug();
        let c = 1;
        window.a = 1;
        console.log(a, b);
        return a + b
    }
}
function plus(a, b) {
    let c = 1;
    window.a = 1;
    console.log(a, b);
    new A().plus(1, 2)
    return a + b
}
plus(1, 2);

// debug(plus)

function sum(a, b) {
    let result = a + b; // DevTools pauses on this line.
    return result;
}
// debug(sum); // Pass the function object, not a string.
sum();
console.trace('');