const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const operationInput = document.getElementById("operation");

const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");

const binaryResult = document.getElementById("binaryResult");
const decimalResult = document.getElementById("decimalResult");
const hexResult = document.getElementById("hexResult");

const error = document.getElementById("error");
const steps = document.getElementById("steps");
const secondInput = document.getElementById("secondInput");

// Show or hide the second number for the NOT operation.
operationInput.addEventListener("change", function () {
    secondInput.style.display = operationInput.value === "not" ? "none" : "block";
    error.textContent = "";
});

function binaryToDecimal(binary) {
    return BigInt("0b" + binary);
}

function decimalToBinary(decimal) {
    if (decimal < 0n) {
        return "-" + (-decimal).toString(2);
    }
    return decimal.toString(2);
}

function decimalToHex(decimal) {
    if (decimal < 0n) {
        return "-" + (-decimal).toString(16).toUpperCase();
    }
    return decimal.toString(16).toUpperCase();
}

function calculate() {
    error.textContent = "";

    const binary1 = num1Input.value.trim();
    const binary2 = num2Input.value.trim();
    const operation = operationInput.value;

    if (!/^[01]+$/.test(binary1)) {
        error.textContent = "Enter a valid first binary number (0 or 1 only).";
        return;
    }

    if (operation !== "not" && !/^[01]+$/.test(binary2)) {
        error.textContent = "Enter a valid second binary number (0 or 1 only).";
        return;
    }

    const a = binaryToDecimal(binary1);
    const b = operation === "not" ? 0n : binaryToDecimal(binary2);

    let result;
    let explanation;

    switch (operation) {
        case "add":
            result = a + b;
            explanation = `${binary1} + ${binary2} = ${result.toString(2)}`;
            break;

        case "subtract":
            result = a - b;
            explanation = `${binary1} - ${binary2} = ${decimalToBinary(result)}`;
            break;

        case "multiply":
            result = a * b;
            explanation = `${binary1} × ${binary2} = ${result.toString(2)}`;
            break;

        case "divide":
            if (b === 0n) {
                error.textContent = "Division by zero is not allowed.";
                return;
            }
            result = a / b;
            explanation = `${binary1} ÷ ${binary2} = ${result.toString(2)} (remainder ${(a % b).toString(2)})`;
            break;

        case "and":
            result = a & b;
            explanation = `${binary1} AND ${binary2} = ${result.toString(2)}`;
            break;

        case "or":
            result = a | b;
            explanation = `${binary1} OR ${binary2} = ${result.toString(2)}`;
            break;

        case "xor":
            result = a ^ b;
            explanation = `${binary1} XOR ${binary2} = ${result.toString(2)}`;
            break;

        case "not": {
            // NOT is applied within the number's bit width.
            const bitLength = BigInt(binary1.length);
            const mask = (1n << bitLength) - 1n;
            result = mask ^ a;
            const notResult = result.toString(2).padStart(binary1.length, "0");
            explanation = `NOT ${binary1} = ${notResult} (within ${bitLength} bits)`;
            break;
        }

        default:
            error.textContent = "Please select a valid operation.";
            return;
    }

    binaryResult.textContent = decimalToBinary(result);
    decimalResult.textContent = result.toString();
    hexResult.textContent = decimalToHex(result);
    steps.textContent = explanation;
}

function clearCalculator() {
    num1Input.value = "";
    num2Input.value = "";
    operationInput.value = "add";
    secondInput.style.display = "block";

    binaryResult.textContent = "---";
    decimalResult.textContent = "---";
    hexResult.textContent = "---";

    error.textContent = "";
    steps.textContent = "Enter binary numbers to start.";
}

calculateBtn.addEventListener("click", calculate);
clearBtn.addEventListener("click", clearCalculator);

// Allow Enter to calculate from either input.
[num1Input, num2Input].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") calculate();
    });
});
