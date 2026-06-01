export interface NurseryActivity {
  id: string;
  title: string;
  ageGroup: string;
  type: "matching" | "shape-matching" | "colour-matching" | "tracing" | "odd-one" | "colouring" | "trace-colour" | "shape-match" | "one-many" | "balloon-colour" | "biggest" | "odd-color-shape" | "match-half" | "color-legend" | "recognition";
  instructions: string;
  items: any[];
  printable: boolean;
}

export const NURSERY_ACTIVITIES: NurseryActivity[] = [
  {
    id: "act_1",
    title: "Match Same Object",
    ageGroup: "Age 2+",
    type: "matching",
    instructions: "Look at the cute items! Connect the same objects on the left and right sides.",
    items: ["car", "fish", "kite", "bucket", "lollipop"],
    printable: true
  },
  {
    id: "act_2",
    title: "Shape Matching",
    ageGroup: "Age 2+",
    type: "shape-matching",
    instructions: "Connect each geometric shape on the left with its real-world household object on the right!",
    items: [
      { shape: "Circle", obj: "Ball" },
      { shape: "Triangle", obj: "Warning sign" },
      { shape: "Square", obj: "Clock" },
      { shape: "Rectangle", obj: "TV" },
      { shape: "Star", obj: "Window" }
    ],
    printable: true
  },
  {
    id: "act_3",
    title: "Match the Colour",
    ageGroup: "Age 2+",
    type: "colour-matching",
    instructions: "Drag lines to match each delicious fruit or object with its matching color bubble!",
    items: [
      { name: "Apple", color: "red" },
      { name: "Banana", color: "yellow" },
      { name: "Orange", color: "orange" },
      { name: "Grapes", color: "purple" },
      { name: "Pear", color: "green" }
    ],
    printable: true
  },
  {
    id: "act_4",
    title: "Tracing Lines",
    ageGroup: "Age 2+",
    type: "tracing",
    instructions: "Hold your crayon! Help the raindrops fall from the cloud and trace the straight, wavy, and zig-zag lines.",
    items: ["straight", "slanting", "curved", "zigzag", "wavy", "raindrops"],
    printable: true
  },
  {
    id: "act_5",
    title: "Same or Different",
    ageGroup: "Age 2+",
    type: "odd-one",
    instructions: "Look at each row closely. Click on the item that looks different from the others!",
    items: ["icecreams", "cupcakes", "arrows", "balloons"],
    printable: true
  },
  {
    id: "act_6",
    title: "Colouring Sandbox",
    ageGroup: "Age 2+",
    type: "colouring",
    instructions: "Select your favorite colors and fill the outlines: Tomato (Red), Banana (Yellow), Cloud (Blue), Leaf (Green), Mango (Orange)!",
    items: ["tomato", "banana", "cloud", "leaf", "mango"],
    printable: true
  },
  {
    id: "act_7",
    title: "Trace and Colour",
    ageGroup: "Age 2+",
    type: "trace-colour",
    instructions: "First trace the dotted circles carefully, then fill them with beautiful colors!",
    items: ["circle1", "circle2", "circle3"],
    printable: true
  },
  {
    id: "act_8",
    title: "Match Same Shape",
    ageGroup: "Age 2+",
    type: "shape-match",
    instructions: "Connect the identical shapes! Find the match for Oval, Triangle, Rectangle, Heart, and Square.",
    items: ["oval", "triangle", "rectangle", "heart", "square"],
    printable: true
  },
  {
    id: "act_9",
    title: "One and Many",
    ageGroup: "Age 2+",
    type: "one-many",
    instructions: "Let's count! Match the single 'One' object on the left to its 'Many' group on the right.",
    items: [
      { one: "One Party Hat", many: "Many Party Hats" },
      { one: "One Tree", many: "Many Trees" },
      { one: "One Cap", many: "Many Caps" },
      { one: "One Lemon", many: "Many Lemons" },
      { one: "One Shell", many: "Many Shells" }
    ],
    printable: true
  },
  {
    id: "act_10",
    title: "Colour as per Balloon Outline",
    ageGroup: "Age 2+",
    type: "balloon-colour",
    instructions: "Look at the colorful balloon borders! Fill the inside of each balloon with the same matching border color.",
    items: ["red-border", "yellow-border", "green-border", "blue-border", "purple-border"],
    printable: true
  },
  {
    id: "act_11",
    title: "Circle Biggest One",
    ageGroup: "Age 2+",
    type: "biggest",
    instructions: "Compare the sizes! Find and click on the biggest object in each group.",
    items: ["cloud", "watermelon", "cup", "sun"],
    printable: true
  },
  {
    id: "act_12",
    title: "Circle Odd One out",
    ageGroup: "Age 2+",
    type: "odd-color-shape",
    instructions: "Identify the odd one! One object has a completely different color or shape than the rest of the row.",
    items: ["row1", "row2", "row3", "row4"],
    printable: true
  },
  {
    id: "act_13",
    title: "Match Other Half",
    ageGroup: "Age 2+",
    type: "match-half",
    instructions: "Solve the shape puzzle! Connect the left half of each shape to its correct right half.",
    items: ["triangle", "rectangle", "circle", "semicircle"],
    printable: true
  },
  {
    id: "act_14",
    title: "Colour as per Shape",
    ageGroup: "Age 2+",
    type: "color-legend",
    instructions: "Follow the secret code! Fill Triangles with Pink, Circles with Green, and Squares with Blue.",
    items: [
      { shape: "triangle", targetColor: "pink" },
      { shape: "circle", targetColor: "green" },
      { shape: "square", targetColor: "blue" }
    ],
    printable: true
  },
  {
    id: "act_15",
    title: "Simple Object Recognition",
    ageGroup: "Age 2+",
    type: "recognition",
    instructions: "Can you name this? Click the correct button below that matches the picture shown on the card.",
    items: ["lion", "butterfly", "rocket", "star", "flower"],
    printable: true
  }
];
