const sharedState = {
    currentMode: 'none',
    drawnPoints: [],
    selectedMesh: null,
    selectedVertex: null,
    modeSpecificVariables: {
        draw: {
            scene: null, 
            ground: null,
        },
        extrude: {
            scene: null, 
            ground: null,
        },
    },
};

export default sharedState;