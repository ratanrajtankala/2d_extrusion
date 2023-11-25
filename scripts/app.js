import { createScene } from "./createScene.js";
import { enterDrawMode, exitDrawMode } from "./modes/drawMode.js";
import { enterExtrudeMode, exitExtrudeMode } from "./modes/extrudeMode.js";
import { enterViewMode, exitViewMode } from "./modes/viewMode.js";
import { enterMoveMode, exitMoveMode } from "./modes/moveMode.js";
import {
  enterVertexEditMode,
  exitVertexEditMode,
} from "./modes/VertexEditMode.js";
import sharedState from "./sharedState.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const cm = document.getElementById("currentMode");

let scene,
  drawnPoints,
  camera = [];
let currentMode = "none"; // Initialize with default mode

const setCurrentMode = (newMode) => {
  const prevMode = sharedState.currentMode;
  if (sharedState.currentMode !== newMode) {
    switch (prevMode) {
      case "draw":
        exitDrawMode(canvas);
        break;
      case "extrude":
        exitExtrudeMode();
        break;
      case "move":
        exitMoveMode(canvas, camera);
        break;
      case "vertexEdit":
        exitVertexEditMode();
        break;
      case "view":
        exitViewMode();
        break;
      default:
        console.log("Invalid mode");
        break;
    }

    sharedState.currentMode = newMode;
    switch (newMode) {
      case "draw":
        enterDrawMode(scene, canvas);
        break;
      case "extrude":
        enterExtrudeMode();
        break;
      case "move":
        enterMoveMode(scene, canvas, camera);
        break;
      case "vertexEdit":
        enterVertexEditMode(scene, canvas, camera);
        break;
      case "view":
        enterViewMode();
        break;
      default:
        console.log("Invalid mode");
        break;
    }
  }
  updateCurrentMode(newMode);
};

const updateCurrentMode = () => {
  cm.textContent = `Current Mode: ${sharedState.currentMode}`;
};

// const enterVertexEditMode = () => {
//     // Logic for vertex editing
//     // Allow users to select vertices and move them using mouse interactions
//     currentMode = "vertexEdit";
//     updateCurrentMode();

//     const ground = scene.getMeshByName("ground");
//     let selectedVertex = null;
//     let selectedMesh = null;
//     let selectedVertexIndex = 0; // Index of the selected vertex
//     let isDragging = false; // Flag to indicate vertex dragging
//     console.log ("entering enterVertexEditMode");

//     const pointerDown = (event) => {
//         const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
//         if (pickInfo.hit && pickInfo.pickedMesh !== ground) {
//             selectedMesh = pickInfo.pickedMesh;
//             changeMeshColour(selectedMesh);
//             isDragging = true;

//             selectedVertexIndex = findClosestVertexIndex(selectedMesh, pickInfo.pickedPoint); //selectedVertexIndex
//             let vertices = transformedVertices(selectedMesh);
//             if (selectedVertexIndex !== null) {
//                 // Perform vertex selection visual feedback
//                 // For example, change color or scale of the selected vertex
//                 console.log("vertex: ", selectedVertexIndex);
//                 const vertexPosition = new BABYLON.Vector3(
//                   vertices[selectedVertexIndex * 3], // x-coordinate of the vertex
//                   vertices[selectedVertexIndex * 3 + 1], // y-coordinate of the vertex
//                   vertices[selectedVertexIndex * 3 + 2] // z-coordinate of the vertex
//                 );

//                 // const sphere = addSphereNearVertex(scene, vertexPosition);
//                 const sphereRadius = 0.1; // Adjust the radius of the spheres as needed
//                 const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
//                 sphereMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0); // Adjust color as desired
//                 const sphere = BABYLON.MeshBuilder.CreateSphere(`sphere`, { diameter: sphereRadius * 2 }, scene);
//                 sphere.material = sphereMaterial;
//                 sphere.position = vertices[selectedVertexIndex];
//             }
//         }
//     }

//     const pointerUp = (event) => {
//         if (isDragging) {
//             const pickResult = scene.pick(scene.pointerX, scene.pointerY);
//             if (pickResult.hit && pickResult.pickedMesh === selectedMesh) {
//                 const newPosition = pickResult.pickedPoint;
//                 moveSelectedVertex(newPosition, selectedVertexIndex, selectedMesh);
//             }
//         }
//     }

//     const pointerMove = (event) => {
//         isDragging = false;
//     }

//     canvas.addEventListener("pointerdown", pointerDown);
//     canvas.addEventListener("pointermove", pointerMove);
//     canvas.addEventListener("pointerup", pointerUp);
// }

// const findClosestVertexIndex = (mesh, point) => {
//     const vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
//     const worldMatrix = mesh.getWorldMatrix();

//     let minDistance = Number.MAX_VALUE;
//     let closestVertexIndex = -1;

//     for (let i = 0; i < vertices.length; i += 3) {
//         let vertex = BABYLON.Vector3.FromArray(vertices, i).multiply(mesh.scaling); // Get vertex in world space
//         vertex = BABYLON.Vector3.TransformCoordinates(vertex, worldMatrix); // Transform to world coordinates

//         const distance = BABYLON.Vector3.Distance(vertex, point);
//         if (distance < minDistance) {
//             minDistance = distance;
//             closestVertexIndex = i / 3; // Divide by 3 to get the index
//         }
//     }

//     return closestVertexIndex;
// };

// // Function to move the selected vertex
// const moveSelectedVertex = (newPosition, selectedVertexIndex, selectedMesh) => {
//     const positions = selectedMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
//     positions[selectedVertexIndex * 3] = newPosition.x;
//     positions[selectedVertexIndex * 3 + 1] = newPosition.y;
//     positions[selectedVertexIndex * 3 + 2] = newPosition.z;

//     selectedMesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
//     selectedMesh._resetPointsArrayCache();
//     selectedMesh._resetNormalsCache();
//     selectedMesh._resetFacetData();
//     selectedMesh.computeWorldMatrix(true);
// };

// OLDERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR from below

// Function to handle vertex editing mode
// const enterVertexEditMode = () => {
//   // Logic for vertex editing
//   // Allow users to select vertices and move them using mouse interactions
//   currentMode = "vertexEdit";
//   updateCurrentMode();

//   const ground = scene.getMeshByName("ground");
//   let selectedVertex = null;
//   let selectedMesh = null;

//   const pointerDown = (event) => {
//     const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
//     if (pickInfo.hit && pickInfo.pickedMesh !== ground) {
//       // Check if the picked mesh is not the ground
//       selectedMesh = pickInfo.pickedMesh;

//     //   addSpheresToVertices(selectedMesh);
//       let currentVertices = transformedVertices (selectedMesh);

//       changeMeshColour(selectedMesh);

//       const vertices = selectedMesh.getVerticesData(
//         BABYLON.VertexBuffer.PositionKind
//       );

//       console.log("verticesssss: ", vertices);
//       // Logic to identify the clicked vertex on the selected mesh
//       // For example, find the closest vertex to the picked point:
//       selectedVertex = findClosestVertex(selectedMesh, pickInfo.pickedPoint);
//       if (selectedVertex !== null) {
//         // Perform vertex selection visual feedback
//         // For example, change color or scale of the selected vertex
//         console.log("vertex: ", selectedVertex);
//         const vertexPosition = new BABYLON.Vector3(
//           vertices[selectedVertex * 3], // x-coordinate of the vertex
//           vertices[selectedVertex * 3 + 1], // y-coordinate of the vertex
//           vertices[selectedVertex * 3 + 2] // z-coordinate of the vertex
//         );

//         const sphere = addSphereNearVertex(scene, vertexPosition);
//       }
//     }
//   };

//   const addSphereNearVertex = (scene, position) => {
//     const sphere = BABYLON.MeshBuilder.CreateSphere(
//       "sphere",
//       { diameter: 0.2 },
//       scene
//     );
//     sphere.position = position.clone(); // Position the sphere at the selected vertex
//     sphere.material = new BABYLON.StandardMaterial("sphereMat", scene);
//     sphere.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Set sphere color
//     return sphere;
//   };

//   function addSpheresToVertices(selectedMesh) {

//     const vertices = transformedVertices(selectedMesh);
//     // Loop through the transformed vertices and create spheres at those positions
//     const sphereRadius = 0.1; // Adjust the radius of the spheres as needed
//     const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
//     sphereMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Adjust color as desired

//     for (let i = 0; i < vertices.length; i++) {
//         const sphere = BABYLON.MeshBuilder.CreateSphere(`sphere${i}`, { diameter: sphereRadius * 2 }, scene);
//         sphere.material = sphereMaterial;
//         sphere.position = vertices[i];
//     }

//   }

//   const pointerMove = (event) => {
//     if (selectedVertex !== null && selectedMesh !== null) {
//       const pickInfo = scene.pick(
//         scene.pointerX,
//         scene.pointerY,
//         (mesh) => mesh === ground
//       );
//       if (pickInfo.hit) {
//         // Update the position of the selected vertex based on pointer movement
//         const newPosition = pickInfo.pickedPoint.clone();

//         // Retrieve the vertices of the selected mesh
//         const vertices = selectedMesh.getVerticesData(
//           BABYLON.VertexBuffer.PositionKind
//         );

//         // Update the position of the selected vertex
//         vertices[selectedVertex * 3] = newPosition.x; // X-coordinate
//         vertices[selectedVertex * 3 + 1] = newPosition.y; // Y-coordinate
//         vertices[selectedVertex * 3 + 2] = newPosition.z; // Z-coordinate

//         // Update the mesh vertices
//         selectedMesh.updateVerticesData(
//           BABYLON.VertexBuffer.PositionKind,
//           vertices
//         );

//         // Recalculate mesh normals and update
//         selectedMesh.createNormals();
//         selectedMesh.refreshBoundingInfo();
//       }
//     }
//   };

//   const pointerUp = (event) => {
//     // Clear the selected vertex and mesh when the pointer is released
//     selectedVertex = null;
//     selectedMesh = null;
//   };

//   // Event listeners for pointer events
//   canvas.addEventListener("pointerdown", pointerDown);
//   canvas.addEventListener("pointermove", pointerMove);
//   canvas.addEventListener("pointerup", pointerUp);
// };

const addSphereNearVertex = (scene, position) => {
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.2 },
    scene
  );
  sphere.position = position.clone(); // Position the sphere at the selected vertex
  sphere.material = new BABYLON.StandardMaterial("sphereMat", scene);
  sphere.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Set sphere color
  return sphere;
};

function changeMeshColour(selectedMesh) {
  let newMaterial = new BABYLON.StandardMaterial("newMaterial", scene);
  newMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1); // Change to red color (RGB: 1, 0, 0)
  selectedMesh.material = newMaterial;
}

function transformedVertices(selectedMesh) {
  // Get the updated world matrix of the mesh after transformation
  const worldMatrix = selectedMesh.getWorldMatrix();

  // Get the original vertices data
  const originalVerticesData = selectedMesh.getVerticesData(
    BABYLON.VertexBuffer.PositionKind
  );

  // Create an array to store transformed vertices
  const transformedVertices = [];

  // Transform each vertex using the world matrix
  for (let i = 0; i < originalVerticesData.length; i += 3) {
    const vertex = new BABYLON.Vector3(
      originalVerticesData[i],
      originalVerticesData[i + 1],
      originalVerticesData[i + 2]
    );
    const transformedVertex = BABYLON.Vector3.TransformCoordinates(
      vertex,
      worldMatrix
    );
    transformedVertices.push(transformedVertex);
  }
  return transformedVertices;
}

// Function to find the closest vertex to a given point on a mesh
// const findClosestVertex = (mesh, point) => {
//   // Logic to find the closest vertex to the given point on the mesh
//   // For example, iterate through mesh vertices and find the nearest one to the point
//   // Return the index or reference to the closest vertex
//   // You might use vector calculations or mesh methods for vertex manipulation
//   let closestVertexIndex = null;
//   let minDistance = Number.MAX_VALUE;

//   if (!mesh || !point || !mesh.getVerticesData || !mesh.getTotalVertices()) {
//     return closestVertexIndex;
//   }

// //   const vertices = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
//   const vertices = transformedVertices (mesh);

//   for (let i = 0; i < mesh.getTotalVertices(); i += 3) {
//     const vertex = new BABYLON.Vector3(
//       vertices[i],
//       vertices[i + 1],
//       vertices[i + 2]
//     );
//     const distance = BABYLON.Vector3.DistanceSquared(vertex, point);

//     if (distance < minDistance) {
//       minDistance = distance;
//       closestVertexIndex = i / 3; // Index of the closest vertex
//     }
//   }

//   return closestVertexIndex;
// };

function findClosestVertex(mesh, selectedPoint) {
  var closestVertexIndex = -1;
  var closestDistance = Number.MAX_VALUE;

  // Get transformed vertex positions of the mesh
  var vertexData = BABYLON.VertexData.ExtractFromMesh(mesh);
  var transformedPositions = transformedVertices(mesh);

  // Loop through the transformed vertex positions
  for (var i = 0; i < transformedPositions.length; i += 3) {
    var vertex = new BABYLON.Vector3(
      transformedPositions[i],
      transformedPositions[i + 1],
      transformedPositions[i + 2]
    );

    // Calculate distance between the selected point and the current vertex
    var distance = BABYLON.Vector3.Distance(vertex, selectedPoint);

    // Check if this vertex is closer than the previously closest one
    if (distance < closestDistance) {
      closestDistance = distance;
      closestVertexIndex = i / 3; // Calculate the vertex index
    }
  }

  // Return the index of the closest vertex
  return closestVertexIndex;
}

// Event listeners for mode buttons
// Event listeners for mode buttons

const viewButton = document.getElementById("viewButton");
viewButton.addEventListener("click", () => {
  setCurrentMode("view");
});
const drawButton = document.getElementById("drawButton");
drawButton.addEventListener("click", () => {
  setCurrentMode("draw");
});

const extrudeButton = document.getElementById("extrudeButton");
extrudeButton.addEventListener("click", () => {
  setCurrentMode("extrude");
});

const moveButton = document.getElementById("moveButton");
moveButton.addEventListener("click", () => {
  setCurrentMode("move");
});

const vertexEditButton = document.getElementById("vertexEditButton");
vertexEditButton.addEventListener("click", () => {
  setCurrentMode("vertexEdit");
});

// Babylon.js Engine Initialization
window.addEventListener("DOMContentLoaded", () => {
  let obj = createScene(engine, canvas);
  scene = obj.scene;
  camera = obj.camera;
  sharedState.camera = camera;
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", () => {
    engine.resize();
  });
});
