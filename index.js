let array = [];
let isSorting = false;
const arrayContainer = document.getElementById("array-container");
const algorithmSelect = document.getElementById("algorithm");
const arraySizeSlider = document.getElementById("array-size");
const arraySizeDisplay = document.getElementById("array-size-display");

function getSortingSpeed() {
    const speedSelect = document.getElementById("speed");
    return parseInt(speedSelect.value); 
}

function resetArray() {
    if (isSorting) return; 

    const arraySize = parseInt(arraySizeSlider.value); 
    arrayContainer.innerHTML = "";
    array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 300) + 50);

    const barWidth = arrayContainer.clientWidth / arraySize; 

    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth - 2}px`; 
        
        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.innerText = value;
        bar.appendChild(label);
        
        arrayContainer.appendChild(bar);
    });
}


function updateArraySizeDisplay() {
    arraySizeDisplay.innerText = arraySizeSlider.value;
    if (!isSorting) resetArray(); 
}

async function startSort() {
    if (isSorting) return; 
    isSorting = true;
    document.querySelector("button[onclick='startSort()']").disabled = true;
    document.querySelector("button[onclick='resetArray()']").disabled = true;
    const algorithm = algorithmSelect.value;

    const delay = getSortingSpeed();
    if (algorithm === "bubble") await bubbleSort(delay);
    else if (algorithm === "selection") await selectionSort(delay);
    else if (algorithm === "insertion") await insertionSort(delay);
    else if (algorithm === "merge") await mergeSort(delay);
    else if (algorithm === "quick") await quickSort(delay);

    isSorting = false;
    document.querySelector("button[onclick='startSort()']").disabled = false;
    document.querySelector("button[onclick='resetArray()']").disabled = false;
}

function stopSort() {
    isSorting = false;
}

async function bubbleSort(delay) {
    for (let i = 0; i < array.length && isSorting; i++) {
        for (let j = 0; j < array.length - i - 1 && isSorting; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateArray();
                await sleep(delay); 
            }
        }
    }
}

async function selectionSort(delay) {
    const n = array.length;
    for (let i = 0; i < n - 1 && isSorting; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n && isSorting; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            updateArray();
            await sleep(delay); 
        }
    }
}

async function insertionSort(delay) {
    const n = array.length;
    for (let i = 1; i < n && isSorting; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key && isSorting) {
            array[j + 1] = array[j];
            j--;
            updateArray();
            await sleep(delay); 
        }
        array[j + 1] = key;
        updateArray();
        await sleep(delay); 
    }
}

async function mergeSort(delay) {
    await mergeSortHelper(0, array.length - 1, delay);
}

async function mergeSortHelper(start, end, delay) {
    if (start < end && isSorting) {
        const mid = Math.floor((start + end) / 2);
        await mergeSortHelper(start, mid, delay);
        await mergeSortHelper(mid + 1, end, delay);
        await merge(start, mid, end, delay);
    }
}

async function merge(start, mid, end, delay) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length && isSorting) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        updateArray();
        await sleep(delay); 
        k++;
    }

    while (i < left.length && isSorting) {
        array[k] = left[i];
        updateArray();
        await sleep(delay); 
        i++;
        k++;
    }

    while (j < right.length && isSorting) {
        array[k] = right[j];
        updateArray();
        await sleep(delay); 
        j++;
        k++;
    }
}

async function quickSort(delay) {
    await quickSortHelper(0, array.length - 1, delay);
}

async function quickSortHelper(low, high, delay) {
    if (low < high && isSorting) {
        const pi = await partition(low, high, delay);
        await quickSortHelper(low, pi - 1, delay);
        await quickSortHelper(pi + 1, high, delay);
    }
}

async function partition(low, high, delay) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high && isSorting; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateArray();
            await sleep(delay); 
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateArray();
    await sleep(delay); 
    return i + 1;
}


function updateArray() {
    const arraySize = array.length; 
    const barWidth = arrayContainer.clientWidth / arraySize; 

    arrayContainer.innerHTML = ""; 

    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth - 2}px`; 
        
        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.innerText = value;
        bar.appendChild(label);
        
        arrayContainer.appendChild(bar);
    });
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

resetArray();
updateArraySizeDisplay();