//HTML Question
const htmlQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlink Text Management Language"],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Who is making the Web standards?",
    options: ["Mozilla", "Microsoft", "Google", "W3C"],
    answer: "W3C"
  },
  {
    question: "Choose the correct HTML element for the largest heading:",
    options: ["<heading>", "<h6>", "<head>", "<h1>"],
    answer: "<h1>"
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    options: ["<lb>", "<br>", "<break>", "<line>"],
    answer: "<br>"
  },
  {
    question: "Which HTML element defines the title of a document?",
    options: ["<meta>", "<title>", "<head>", "<body>"],
    answer: "<title>"
  },
  {
    question: "What is the correct HTML for adding a background color?",
    options: ["<body bg='yellow'>", "<body style='background-color:yellow;'>", "<background>yellow</background>", "<bg>yellow</bg>"],
    answer: "<body style='background-color:yellow;'>"
  },
  {
    question: "Choose the correct HTML element to define important text",
    options: ["<important>", "<i>", "<b>", "<strong>"],
    answer: "<strong>"
  },
  {
    question: "Which character is used to indicate an end tag?",
    options: ["^", "/", "*", "<"],
    answer: "/"
  },
  {
    question: "How can you open a link in a new tab/browser window?",
    options: ["<a href='url' target='open'>", "<a href='url' new>", "<a href='url' target='_blank'>", "<a new tab='true' href='url'>"],
    answer: "<a href='url' target='_blank'>"
  },
  {
    question: "Which HTML element defines emphasized text?",
    options: ["<italic>", "<i>", "<em>", "<strong>"],
    answer: "<em>"
  },
  // ... more to come
];

//CSS question starts here

const cssQuestions = [

  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
      "Creative Style Sheets"
    ],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Which HTML tag is used to reference an external CSS file?",
    options: ["<css>", "<link>", "<style>", "<stylesheet>"],
    answer: "<link>"
  },
  {
    question: "Which property is used to change the background color?",
    options: ["color", "background", "bgcolor", "background-color"],
    answer: "background-color"
  },
  {
    question: "How do you select an element with the id 'main' in CSS?",
    options: ["#main", ".main", "main", "*main"],
    answer: "#main"
  },
  {
    question: "How do you select all elements with class 'item'?",
    options: [".item", "#item", "*item", "item"],
    answer: ".item"
  },
  {
    question: "Which property is used to change the text color?",
    options: ["text-color", "font-color", "color", "foreground-color"],
    answer: "color"
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-style", "font-size", "text-size"],
    answer: "font-size"
  },
  {
    question: "How do you make all <p> elements bold?",
    options: ["p { font-weight: bold; }", "p { text-style: bold; }", "p { bold: true; }", "p { font: bold; }"],
    answer: "p { font-weight: bold; }"
  },
  {
    question: "Which property is used to center text?",
    options: ["text-align", "align", "text-center", "font-align"],
    answer: "text-align"
  },
  {
    question: "What value of `position` places an element relative to its nearest positioned ancestor?",
    options: ["absolute", "relative", "fixed", "static"],
    answer: "absolute"
  },
  // ... more to come
];

//JS Starts here 

const jsQuestions = [

  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["var", "let", "const", "All of the above"],
    answer: "All of the above"
  },
  {
    question: "What is the correct syntax to output 'Hello World' in the console?",
    options: [
      "console.log('Hello World');",
      "print('Hello World');",
      "echo('Hello World');",
      "log.console('Hello World');"
    ],
    answer: "console.log('Hello World');"
  },
  {
    question: "Which of the following is a JavaScript data type?",
    options: ["String", "Boolean", "Undefined", "All of the above"],
    answer: "All of the above"
  },
  {
    question: "What is the result of `typeof null` in JavaScript?",
    options: ["null", "object", "undefined", "boolean"],
    answer: "object"
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function myFunc() {}",
      "create myFunc() {}",
      "function:myFunc()",
      "def myFunc()"
    ],
    answer: "function myFunc() {}"
  },
  {
    question: "Which operator is used to compare both value and type?",
    options: ["==", "===", "!=", "!="],
    answer: "==="
  },
  {
    question: "Which array method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    question: "Which statement is used to stop a loop?",
    options: ["stop", "exit", "break", "end"],
    answer: "break"
  },
  {
    question: "Which method can convert JSON text to a JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "parse.JSON()", "stringify.JSON()"],
    answer: "JSON.parse()"
  },
  {
    question: "What will `2 + '2'` evaluate to?",
    options: ["4", "22", "NaN", "undefined"],
    answer: "22"
  },

]